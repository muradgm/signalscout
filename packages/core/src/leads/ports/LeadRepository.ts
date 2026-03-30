import type { Lead, LeadNiche, LeadSource } from '../entities/Lead.js';

export interface CreateLeadInput {
  companyName: string;
  website: string;
  niche: LeadNiche;
  location: string;
  country: string;
  source: LeadSource;
}

export interface LeadRepository {
  create(input: CreateLeadInput): Promise<Lead>;
  findById(id: string): Promise<Lead | null>;
  findMany(): Promise<Lead[]>;
}