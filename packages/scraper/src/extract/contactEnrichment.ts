import type {
  ContactConfidence,
  ContactEnrichment,
  ContactInfo,
  ContactSourceKind,
  ContactValueType,
  ContactValueWithSource,
} from '@signalscout/core';

const uniqueBy = <T>(values: T[], keyFn: (value: T) => string): T[] => {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = keyFn(value);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const createItems = (
  values: string[],
  type: ContactValueType,
  sourceKind: ContactSourceKind,
  sourceUrl: string,
  confidence: ContactConfidence,
): ContactValueWithSource[] =>
  values.map((value) => ({
    type,
    value,
    sourceKind,
    sourceUrl,
    confidence,
  }));

const toItemKey = (value: ContactValueWithSource): string =>
  `${value.type}|${value.value.toLowerCase()}|${value.sourceKind}|${value.sourceUrl.toLowerCase()}`;

export const createContactEnrichment = (
  contactInfo: ContactInfo,
  sourceKind: ContactSourceKind,
  sourceUrl: string,
  confidence: ContactConfidence,
): ContactEnrichment => {
  return {
    emails: createItems(contactInfo.emails, 'email', sourceKind, sourceUrl, confidence),
    phones: createItems(contactInfo.phones, 'phone', sourceKind, sourceUrl, confidence),
    addresses: createItems(contactInfo.addresses, 'address', sourceKind, sourceUrl, confidence),
  };
};

export const mergeContactEnrichment = (
  ...values: ContactEnrichment[]
): ContactEnrichment => {
  return {
    emails: uniqueBy(
      values.flatMap((value) => value.emails),
      toItemKey,
    ),
    phones: uniqueBy(
      values.flatMap((value) => value.phones),
      toItemKey,
    ),
    addresses: uniqueBy(
      values.flatMap((value) => value.addresses),
      toItemKey,
    ),
  };
};
