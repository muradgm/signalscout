import type { Lead } from '../entities/Lead.js';
import type { LeadRepository } from '../ports/LeadRepository.js';

export class ListLeads {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(): Promise<Lead[]> {
    return this.leadRepository.findMany();
  }
}