import type {
  DeliveryEvent,
  DeliveryEventSummary,
  DeliveryEventType,
  DeliveryProvider,
} from '../entities/OutreachMessage.js';

export interface SaveDeliveryEventInput {
  outreachId: string;
  leadId: string;
  provider: DeliveryProvider;
  providerMessageId: string | null;
  eventType: DeliveryEventType;
  occurredAt: Date;
  summary: string | null;
  errorCode: string | null;
  retryable: boolean;
}

export interface DeliveryEventRepository {
  save(input: SaveDeliveryEventInput): Promise<DeliveryEvent>;
  findLatestByOutreachId(outreachId: string, limit?: number): Promise<DeliveryEvent[]>;
  summarizeByOutreachId(outreachId: string): Promise<DeliveryEventSummary>;
  findOutreachIdByProviderMessageId(
    provider: DeliveryProvider,
    providerMessageId: string,
  ): Promise<string | null>;
}
