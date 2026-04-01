type OutreachStatusBadgeProps = {
  recommendation: string;
};

const getTone = (value: string): 'good' | 'review' | 'bad' | 'neutral' => {
  const normalized = value.toLowerCase();

  if (normalized.includes('send')) {
    return 'good';
  }

  if (normalized.includes('review')) {
    return 'review';
  }

  if (normalized.includes('do_not_send') || normalized.includes('withheld')) {
    return 'bad';
  }

  return 'neutral';
};

export function OutreachStatusBadge({
  recommendation,
}: OutreachStatusBadgeProps) {
  const tone = getTone(recommendation);

  return (
    <span className={`status-badge is-${tone}`}>
      {recommendation.replace(/_/g, ' ')}
    </span>
  );
}
