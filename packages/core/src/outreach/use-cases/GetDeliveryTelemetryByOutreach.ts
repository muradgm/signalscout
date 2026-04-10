import type {
  DeliveryEvent,
  DeliveryEventSummary,
} from '../entities/OutreachMessage.js';
import type { DeliveryEventRepository } from '../ports/DeliveryEventRepository.js';

export class GetDeliveryTelemetryByOutreach {
  constructor(private readonly deliveryEventRepository: DeliveryEventRepository) {}

  async execute(outreachId: string): Promise<{
    recentEvents: DeliveryEvent[];
    summary: DeliveryEventSummary;
  }> {
    const [recentEvents, summary] = await Promise.all([
      this.deliveryEventRepository.findLatestByOutreachId(outreachId, 5),
      this.deliveryEventRepository.summarizeByOutreachId(outreachId),
    ]);

    return {
      recentEvents,
      summary,
    };
  }
}
