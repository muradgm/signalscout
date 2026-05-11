import OpenAI from 'openai';
import type {
  GenerateOutreachInput,
  GeneratedOutreachDraft,
  OutreachGenerator,
} from '@signalscout/core';
import { outreachOutputSchema } from '../policies/outreachOutputSchema.js';
import { buildOutreachPrompt } from '../prompts/outreach.prompt.js';

export interface OpenAiOutreachGeneratorOptions {
  apiKey: string;
  model?: string;
}

const extractJsonObject = (content: string): string => {
  const trimmed = content.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('AI response did not contain a valid JSON object');
  }

  return trimmed.slice(firstBrace, lastBrace + 1);
};

export class OpenAiOutreachGenerator implements OutreachGenerator {
  private readonly client: OpenAI;
  private readonly model: string;
  private static readonly MAX_RETRIES = 3;
  private static readonly BASE_RETRY_DELAY_MS = 500;

  constructor(options: OpenAiOutreachGeneratorOptions) {
    this.client = new OpenAI({ apiKey: options.apiKey });
    this.model = options.model ?? 'gpt-4.1-mini';
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isRetryableError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const candidate = error as {
      status?: number;
      code?: string;
      response?: { status?: number };
    };
    const status = candidate.status ?? candidate.response?.status;

    return [429, 502, 503, 504].includes(status ?? -1) ||
      ['rate_limit_error', 'server_error'].includes(candidate.code ?? '');
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (error) {
        attempt += 1;

        if (
          attempt > OpenAiOutreachGenerator.MAX_RETRIES ||
          !this.isRetryableError(error)
        ) {
          throw error;
        }

        const delayMs =
          OpenAiOutreachGenerator.BASE_RETRY_DELAY_MS * 2 ** (attempt - 1);
        await this.delay(delayMs);
      }
    }
  }

  async generate(
    input: GenerateOutreachInput,
  ): Promise<GeneratedOutreachDraft> {
    const prompt = buildOutreachPrompt(input);

    const response = await this.withRetry(() =>
      this.client.responses.create({
        model: this.model,
        input: prompt,
      }),
    );

    const outputText = response.output_text;
    if (!outputText?.trim()) {
      throw new Error('AI response was empty');
    }

    const parsed = JSON.parse(extractJsonObject(outputText));
    const validated = outreachOutputSchema.parse(parsed);

    if (
      validated.recommendation !== 'do_not_send' &&
      (validated.subject === null || validated.body === null)
    ) {
      throw new Error(
        'AI outreach response must include subject and body for send/review recommendations',
      );
    }

    return {
      recommendation: validated.recommendation,
      fitReason: validated.fitReason,
      bestAngle: validated.bestAngle,
      subject:
        validated.recommendation === 'do_not_send' ? null : validated.subject,
      body: validated.recommendation === 'do_not_send' ? null : validated.body,
      reasoning: validated.reasoning,
      evidence: validated.evidence,
    };
  }
}
