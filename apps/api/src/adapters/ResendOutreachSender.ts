import type {
  OutreachSendInput,
  OutreachSendResult,
  OutreachSender,
} from '@signalscout/core';

const createOutreachSendError = (code: string, message: string): Error & { code: string } => {
  const error = new Error(message) as Error & { code: string };
  error.name = 'OutreachSendError';
  error.code = code;
  return error;
};

export class ResendOutreachSender implements OutreachSender {
  constructor(
    private readonly apiKey: string,
    private readonly fromEmail: string,
    private readonly fromName: string,
    private readonly replyToEmail: string,
  ) {}

  async send(input: OutreachSendInput): Promise<OutreachSendResult> {
    if (!this.apiKey) {
      throw createOutreachSendError(
        'configuration',
        'RESEND_API_KEY is not configured',
      );
    }

    if (!this.fromEmail.trim()) {
      throw createOutreachSendError(
        'configuration',
        'RESEND_FROM_EMAIL is not configured',
      );
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${this.fromName.trim() || 'SignalScout'} <${this.fromEmail.trim()}>`,
        to: [input.to],
        reply_to: this.replyToEmail.trim() || undefined,
        subject: input.subject,
        text: input.body,
      }),
    });

    if (!response.ok) {
      const payload = await response.text().catch(() => '');
      throw createOutreachSendError(
        'provider_failed',
        `Resend send failed with status ${response.status}${payload ? `: ${payload}` : ''}`,
      );
    }

    const payload = (await response.json().catch(() => null)) as { id?: unknown } | null;

    return {
      provider: 'resend',
      providerMessageId:
        payload && typeof payload.id === 'string' && payload.id.trim().length > 0
          ? payload.id.trim()
          : null,
    };
  }
}
