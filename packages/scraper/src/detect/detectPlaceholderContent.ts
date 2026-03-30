const PLACEHOLDER_PATTERNS: RegExp[] = [
  /soeben freigeschaltete homepage/i,
  /under construction/i,
  /coming soon/i,
  /website coming soon/i,
  /domain parked/i,
  /default page/i,
  /this site is under construction/i,
  /placeholder/i,
  /webmaster@/i,
];

export const detectPlaceholderContent = (text: string): boolean => {
  const normalized = text.trim();

  if (!normalized) {
    return true;
  }

  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalized));
};