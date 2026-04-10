import type { CreateLeadInput, Lead, LeadRepository } from '@signalscout/core';
import { mapLeadDocumentToEntity } from '../mappers/lead.mapper.js';
import { LeadModel } from '../models/LeadModel.js';

export class MongoLeadRepository implements LeadRepository {
  async create(input: CreateLeadInput): Promise<Lead> {
    try {
      const document = await LeadModel.create({
        companyName: input.companyName,
        website: input.website,
        niche: input.niche,
        location: input.location,
        country: input.country,
        source: input.source,
        status: 'new',
      });

      return mapLeadDocumentToEntity(document);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as { code?: number }).code === 11000
      ) {
        const conflictError = new Error('Lead with this website already exists');
        conflictError.name = 'ConflictError';
        throw conflictError;
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Lead | null> {
    const document = await LeadModel.findOne({ _id: id }).exec();

    if (!document) {
      return null;
    }

    return mapLeadDocumentToEntity(document);
  }

  async findMany(): Promise<Lead[]> {
    const documents = await LeadModel.find().sort({ createdAt: -1 }).exec();

    return documents.map(mapLeadDocumentToEntity);
  }

  async updateStatus(id: string, status: Lead['status']): Promise<Lead | null> {
    const document = await LeadModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      { new: true },
    ).exec();

    return document ? mapLeadDocumentToEntity(document) : null;
  }
}
