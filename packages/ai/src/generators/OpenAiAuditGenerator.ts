import OpenAI from 'openai';
import type { AuditGenerator, GenerateAuditInput, GeneratedAuditDraft } from '@signalscout/core';
import { auditOutputSchema } from '../policies/auditOutputSchema.js';
import { buildAuditPrompt } from '../prompts/audit.prompt.js';

export interface OpenAiAuditGeneratorOptions {
  apiKey: string;
  model?: string;
}

const extractJsonObject = (content: string): string => {
  const trimmed = content.trim();

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('AI response did not contain a valid JSON object');
  }

  return trimmed.slice(firstBrace, lastBrace + 1);
};

export class OpenAiAuditGenerator implements AuditGenerator {
  private readonly client: OpenAI;
  private readonly model: string;
  private static readonly MAX_RETRIES = 3;
  private static readonly BASE_RETRY_DELAY_MS = 500;

  constructor(options: OpenAiAuditGeneratorOptions) {
    this.client = new OpenAI({
      apiKey: options.apiKey,
    });

    this.model = options.model ?? 'gpt-4.1-mini';
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isRetryableError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const candidate = error as { status?: number; code?: string; response?: { status?: number } };
    const status = candidate.status ?? candidate.response?.status;

    return (
      status === 429 ||
      status === 502 ||
      status === 503 ||
      status === 504 ||
      candidate.code === 'rate_limit_error' ||
      candidate.code === 'server_error'
    );
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (error) {
        attempt += 1;

        if (attempt > OpenAiAuditGenerator.MAX_RETRIES || !this.isRetryableError(error)) {
          throw error;
        }

        const delayMs = OpenAiAuditGenerator.BASE_RETRY_DELAY_MS * 2 ** (attempt - 1);
        await this.delay(delayMs);
      }
    }
  }

  async generate(input: GenerateAuditInput): Promise<GeneratedAuditDraft> {
    const prompt = buildAuditPrompt(input);

    const response = await this.withRetry(() =>
      this.client.responses.create({
        model: this.model,
        input: prompt,
      }),
    );

    const outputText = response.output_text;

    if (!outputText || !outputText.trim()) {
      throw new Error('AI response was empty');
    }

    const jsonText = extractJsonObject(outputText);
    const parsed = JSON.parse(jsonText);
    const validated = auditOutputSchema.parse(parsed);

    return {
      summary: validated.summary,
      strengths: validated.strengths,
      opportunities: validated.opportunities,
      opportunityDetails: validated.opportunityDetails,
      risks: validated.risks,
      recommendedAngle: validated.recommendedAngle,
      confidenceNote: validated.confidenceNote,
      evidence: validated.evidence,
    };
  }
}