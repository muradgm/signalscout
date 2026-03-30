export const auditWritingPolicy = {
  forbiddenPhrases: [
    'reduces hesitation',
    'builds trust',
    'increases confidence',
    'improves perception',
    'enhances credibility',
    'strengthens legitimacy',
  ],

  allowedTransformations: [
    {
      from: 'builds trust',
      to: 'includes visible trust indicators',
    },
    {
      from: 'reduces hesitation',
      to: 'may make decision-making easier for users',
    },
  ],

  enforceEvidenceLanguage: (text: string): string => {
    let result = text;

    for (const phrase of auditWritingPolicy.forbiddenPhrases) {
      if (result.toLowerCase().includes(phrase)) {
        result = result.replace(
          new RegExp(phrase, 'gi'),
          '[unsupported phrasing removed]',
        );
      }
    }

    return result;
  },
};