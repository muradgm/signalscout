type LeadStatusTone = 'good' | 'review' | 'bad' | 'neutral';

const getTone = (value: string): LeadStatusTone => {
  const normalized = value.toLowerCase();

  if (normalized.includes('good') || normalized.includes('send')) {
    return 'good';
  }

  if (normalized.includes('review') || normalized.includes('uncertain')) {
    return 'review';
  }

  if (normalized.includes('poor') || normalized.includes('do_not_send')) {
    return 'bad';
  }

  return 'neutral';
};

type LeadStatusBadgeProps = {
  label: string;
  compact?: boolean;
};

export function LeadStatusBadge({
  label,
  compact = false,
}: LeadStatusBadgeProps) {
  const tone = getTone(label);

  return (
    <span className={`status-badge is-${tone}${compact ? ' is-compact' : ''}`}>
      {label.replace(/_/g, ' ')}
    </span>
  );
}
