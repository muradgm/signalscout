import type { Lead } from '../entities/Lead.js';
import type { CreateLeadInput, LeadRepository } from '../ports/LeadRepository.js';

const normalizeWebsite = (website: string): string => {
  const trimmed = website.trim();

  if (!trimmed) {
    throw new Error('Website is required');
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const assertNonEmpty = (value: string, fieldName: string): string => {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
};

export class CreateLead {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(input: CreateLeadInput): Promise<Lead> {
    const companyName = assertNonEmpty(input.companyName, 'Company name');
    const website = normalizeWebsite(input.website);
    const location = assertNonEmpty(input.location, 'Location');
    const country = assertNonEmpty(input.country, 'Country');

    return this.leadRepository.create({
      companyName,
      website,
      niche: input.niche,
      location,
      country,
      source: input.source,
    });
  }
}