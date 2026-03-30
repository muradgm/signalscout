import type { OutreachRecommendationType } from '../entities/OutreachMessage.js';
import type { OutreachStatus } from '../entities/OutreachMessage.js';

export const mapRecommendationToStatus = (
  recommendation: OutreachRecommendationType,
): OutreachStatus => {
  switch (recommendation) {
    case 'do_not_send':
      return 'withheld';

    case 'review':
      return 'review_required';

    case 'send':
      return 'drafted';

    default:
      return 'drafted';
  }
};