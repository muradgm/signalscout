export interface OutreachSendInput {
  to: string;
  subject: string;
  body: string;
}

export interface OutreachSendResult {
  provider: 'resend';
  providerMessageId: string | null;
}

export type OutreachSendErrorCode =
  | 'not_ready'
  | 'missing_recipient'
  | 'missing_content'
  | 'configuration'
  | 'provider_failed';

export class OutreachSendError extends Error {
  constructor(
    public readonly code: OutreachSendErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'OutreachSendError';
  }
}

export interface OutreachSender {
  send(input: OutreachSendInput): Promise<OutreachSendResult>;
}
