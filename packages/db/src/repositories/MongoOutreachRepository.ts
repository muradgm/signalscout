import type {
  OutreachLearningSummary,
  OutreachMessage,
  OutreachRepository,
  SaveOutreachInput,
} from '@signalscout/core';
import { Types } from 'mongoose';
import { mapOutreachMessageDocumentToEntity } from '../mappers/outreach.mapper.js';
import { OutreachMessageModel } from '../models/OutreachMessageModel.js';

export class MongoOutreachRepository implements OutreachRepository {
  async getLearningSummary(limit: number): Promise<OutreachLearningSummary> {
    const normalize = (value: unknown): string =>
      String(value ?? '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();

    const diffKind = (
      generatedValue: unknown,
      finalValue: unknown,
    ): 'unchanged' | 'added' | 'removed' | 'edited' => {
      const generated = normalize(generatedValue);
      const final = normalize(finalValue);

      if (!generated && !final) return 'unchanged';
      if (!generated && final) return 'added';
      if (generated && !final) return 'removed';
      return generated === final ? 'unchanged' : 'edited';
    };

    const detectLanguageHint = (value: unknown): string => {
      const normalizedValue = normalize(value);
      const englishHints = ['book online', 'request appointment', 'gentle', 'friendly', 'clear aligner'];
      const germanHints = ['termin', 'zahnarzt', 'praxis', 'angstpatient', 'behandlung'];
      const hasEnglish = englishHints.some((hint) => normalizedValue.includes(hint));
      const hasGerman = germanHints.some((hint) => normalizedValue.includes(hint));

      if (hasEnglish && hasGerman) return 'mixed_en_de';
      if (hasEnglish) return 'english_leaning';
      if (hasGerman) return 'german_leaning';
      return 'unclear';
    };

    const detectSpecialtyTags = (value: unknown): string[] => {
      const normalizedValue = normalize(value);
      const rules = [
        { tag: 'implant', patterns: ['implant', 'implantologie', 'implantology'] },
        { tag: 'oral_surgery', patterns: ['oral surgery', 'oralchirurgie', 'wisdom tooth'] },
        { tag: 'endodontics', patterns: ['endodont', 'root canal', 'wurzel'] },
        { tag: 'aligners', patterns: ['aligner', 'invisalign'] },
        { tag: 'pediatric', patterns: ['kinderzahnarzt', 'pediatric', 'children dentistry'] },
      ];

      return rules
        .filter((rule) =>
          rule.patterns.some((pattern) => normalizedValue.includes(pattern)),
        )
        .map((rule) => rule.tag);
    };

    const topCounts = (items: string[], maxItems = 4) =>
      Object.entries(
        items.reduce<Record<string, number>>((accumulator, item) => {
          const key = item || 'unknown';
          accumulator[key] = (accumulator[key] ?? 0) + 1;
          return accumulator;
        }, {}),
      )
        .sort((left, right) => right[1] - left[1])
        .slice(0, maxItems)
        .map(([label, count]) => ({ label, count }));

    const summarizeSegment = (
      items: Array<{
        reviewStatus: string;
      }>,
    ) => {
      const total = items.length;

      return {
        total,
        acceptedRate:
          total > 0
            ? items.filter((item) => item.reviewStatus === 'accepted').length / total
            : 0,
        editedRate:
          total > 0
            ? items.filter((item) => item.reviewStatus === 'edited').length / total
            : 0,
        skippedRate:
          total > 0
            ? items.filter((item) => item.reviewStatus === 'skipped').length / total
            : 0,
      };
    };

    const reviewed = await OutreachMessageModel.aggregate([
      { $match: { reviewStatus: { $in: ['accepted', 'edited', 'skipped', 'held'] } } },
      { $sort: { reviewedAt: -1, _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'leads',
          localField: 'leadId',
          foreignField: '_id',
          as: 'lead',
        },
      },
      {
        $project: {
          lead: { $arrayElemAt: ['$lead', 0] },
          reviewStatus: 1,
          generatedSubject: 1,
          generatedBody: 1,
          subject: 1,
          body: 1,
          bestAngle: 1,
          fitReason: 1,
        },
      },
    ]).exec();

    const annotated = reviewed.map((item) => {
      const subjectDelta = diffKind(item.generatedSubject, item.subject);
      const bodyDelta = diffKind(item.generatedBody, item.body);
      const textBlock = [
        item.fitReason,
        item.bestAngle,
        item.generatedBody,
        item.body,
        item.lead?.companyName,
        item.lead?.niche,
      ]
        .filter(Boolean)
        .join(' ');

      return {
        reviewStatus: String(item.reviewStatus ?? ''),
        bestAngle: String(item.bestAngle ?? 'unknown'),
        niche: String(item.lead?.niche ?? 'unknown'),
        location: String(item.lead?.location ?? 'unknown'),
        subjectDelta,
        bodyDelta,
        languageHint: detectLanguageHint(textBlock),
        specialtyTags: detectSpecialtyTags(textBlock),
        weakSurface: /contact|booking|book|termin|consult|anfrage|soft|indirect/i.test(
          normalize(item.fitReason),
        ),
      };
    });

    const totalReviewed = annotated.length;
    const editedItems = annotated.filter((item) => item.reviewStatus === 'edited');

    return {
      windowSize: limit,
      totalReviewed,
      acceptedRate:
        totalReviewed > 0
          ? annotated.filter((item) => item.reviewStatus === 'accepted').length /
            totalReviewed
          : 0,
      editedRate:
        totalReviewed > 0
          ? editedItems.length / totalReviewed
          : 0,
      skippedRate:
        totalReviewed > 0
          ? annotated.filter((item) => item.reviewStatus === 'skipped').length /
            totalReviewed
          : 0,
      subjectEditedRate:
        totalReviewed > 0
          ? annotated.filter((item) => item.subjectDelta === 'edited').length /
            totalReviewed
          : 0,
      bodyEditedRate:
        totalReviewed > 0
          ? annotated.filter((item) => item.bodyDelta === 'edited').length /
            totalReviewed
          : 0,
      multilingualShare:
        totalReviewed > 0
          ? annotated.filter(
              (item) =>
                item.languageHint === 'mixed_en_de' ||
                item.languageHint === 'english_leaning',
            ).length / totalReviewed
          : 0,
      specialtyShare:
        totalReviewed > 0
          ? annotated.filter((item) => item.specialtyTags.length > 0).length /
            totalReviewed
          : 0,
      topAngles: topCounts(annotated.map((item) => item.bestAngle)),
      topEditedAngles: topCounts(editedItems.map((item) => item.bestAngle)),
      topNiches: topCounts(annotated.map((item) => item.niche)),
      topEditedNiches: topCounts(editedItems.map((item) => item.niche)),
      reviewSegments: {
        nonBerlin: summarizeSegment(
          annotated.filter((item) => normalize(item.location) !== 'berlin'),
        ),
        weakSurface: summarizeSegment(
          annotated.filter((item) => item.weakSurface),
        ),
        specialty: summarizeSegment(
          annotated.filter((item) => item.specialtyTags.length > 0),
        ),
        multilingual: summarizeSegment(
          annotated.filter(
            (item) =>
              item.languageHint === 'mixed_en_de' ||
              item.languageHint === 'english_leaning',
          ),
        ),
      },
    };
  }

  async save(input: SaveOutreachInput): Promise<OutreachMessage> {
    const document = await OutreachMessageModel.create({
      leadId: new Types.ObjectId(input.leadId),
      auditId: new Types.ObjectId(input.auditId),
      channel: input.channel,
      recommendation: input.recommendation,
      fitReason: input.fitReason,
      bestAngle: input.bestAngle,
      generatedSubject: input.generatedSubject,
      generatedBody: input.generatedBody,
      subject: input.subject,
      body: input.body,
      reasoning: input.reasoning,
      evidence: input.evidence,
      status: input.status,
      reviewStatus: input.reviewStatus,
      reviewedAt: input.reviewedAt,
      sentAt: input.sentAt,
      sendAttemptCount: input.sendAttemptCount,
      lastSendAttemptAt: input.lastSendAttemptAt,
      lastSendErrorCode: input.lastSendErrorCode,
      lastSendError: input.lastSendError,
      lastSendRetryable: input.lastSendRetryable,
      deliveryProvider: input.deliveryProvider,
      providerMessageId: input.providerMessageId,
    });

    return mapOutreachMessageDocumentToEntity(document);
  }

  async findLatestByLeadId(leadId: string): Promise<OutreachMessage | null> {
    const document = await OutreachMessageModel.findOne({
      leadId: new Types.ObjectId(leadId),
    })
      .sort({ createdAt: -1, _id: -1 })
      .exec();

    if (!document) {
      return null;
    }

    return mapOutreachMessageDocumentToEntity(document);
  }

  async countByLeadIdAndAuditId(
    leadId: string,
    auditId: string,
  ): Promise<number> {
    return OutreachMessageModel.countDocuments({
      leadId: new Types.ObjectId(leadId),
      auditId: new Types.ObjectId(auditId),
    }).exec();
  }

  async findById(outreachId: string): Promise<OutreachMessage | null> {
    const document = await OutreachMessageModel.findById(
      new Types.ObjectId(outreachId),
    ).exec();

    if (!document) {
      return null;
    }

    return mapOutreachMessageDocumentToEntity(document);
  }

  async findByProviderMessageId(
    providerMessageId: string,
  ): Promise<OutreachMessage | null> {
    const document = await OutreachMessageModel.findOne({
      providerMessageId: providerMessageId.trim(),
    }).exec();

    if (!document) {
      return null;
    }

    return mapOutreachMessageDocumentToEntity(document);
  }

  async updateReview(
    outreachId: string,
    input: {
      reviewStatus: OutreachMessage['reviewStatus'];
      status: OutreachMessage['status'];
      subject: string | null;
      body: string | null;
      reviewedAt: Date;
    },
  ): Promise<OutreachMessage | null> {
    const document = await OutreachMessageModel.findByIdAndUpdate(
      new Types.ObjectId(outreachId),
      {
        $set: {
          reviewStatus: input.reviewStatus,
          status: input.status,
          subject: input.subject,
          body: input.body,
          reviewedAt: input.reviewedAt,
        },
      },
      { new: true },
    ).exec();

    if (!document) {
      return null;
    }

    return mapOutreachMessageDocumentToEntity(document);
  }

  async markSent(
    outreachId: string,
    input: {
      sentAt: Date;
      attemptedAt: Date;
      deliveryProvider: OutreachMessage['deliveryProvider'];
      providerMessageId: string | null;
    },
  ): Promise<OutreachMessage | null> {
    const document = await OutreachMessageModel.findByIdAndUpdate(
      new Types.ObjectId(outreachId),
      {
        $set: {
          status: 'sent',
          sentAt: input.sentAt,
          lastSendAttemptAt: input.attemptedAt,
          lastSendErrorCode: null,
          lastSendError: null,
          lastSendRetryable: false,
          deliveryProvider: input.deliveryProvider,
          providerMessageId: input.providerMessageId,
        },
        $inc: {
          sendAttemptCount: 1,
        },
      },
      { new: true },
    ).exec();

    if (!document) {
      return null;
    }

    return mapOutreachMessageDocumentToEntity(document);
  }

  async recordSendFailure(
    outreachId: string,
    input: {
      attemptedAt: Date;
      errorCode: string;
      errorMessage: string;
      retryable: boolean;
    },
  ): Promise<OutreachMessage | null> {
    const document = await OutreachMessageModel.findByIdAndUpdate(
      new Types.ObjectId(outreachId),
      {
        $set: {
          lastSendAttemptAt: input.attemptedAt,
          lastSendErrorCode: input.errorCode,
          lastSendError: input.errorMessage,
          lastSendRetryable: input.retryable,
        },
        $inc: {
          sendAttemptCount: 1,
        },
      },
      { new: true },
    ).exec();

    if (!document) {
      return null;
    }

    return mapOutreachMessageDocumentToEntity(document);
  }

  async markReplied(
    outreachId: string,
    _input: {
      repliedAt: Date;
    },
  ): Promise<OutreachMessage | null> {
    const document = await OutreachMessageModel.findByIdAndUpdate(
      new Types.ObjectId(outreachId),
      {
        $set: {
          status: 'replied',
        },
      },
      { new: true },
    ).exec();

    return document ? mapOutreachMessageDocumentToEntity(document) : null;
  }
}
