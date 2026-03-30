export const translateGermanToEnglish = (text: string): string => {
  return text
    .replace(
      /sie sehen hier eine soeben freigeschaltete homepage/i,
      'This is a newly activated homepage',
    );
};