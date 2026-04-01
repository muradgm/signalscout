import type { Request, Response } from 'express';
import { NotFoundError } from '../../common/errors/index.js';
import { ok } from '../../common/responses/index.js';
import {
  detectSignalsForOutreachUseCase,
  generateOutreachUseCase,
  getAuditByLeadAndSnapshotForOutreachUseCase,
  getLatestLeadSnapshotForOutreachUseCase,
  getLeadByIdForOutreachUseCase,
  getOutreachByLeadUseCase,
} from '../../wiring/outreach.wiring.js';
import { mapOutreachToResponse } from './outreach.mapper.js';

const validateIdParam = (id: string | string[] | undefined): string => {
  if (typeof id !== 'string' || !id.trim()) {
    throw new NotFoundError('Invalid lead ID');
  }
  return id;
};

export const generateOutreach = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const leadId = validateIdParam(req.params.id);
  const lead = await getLeadByIdForOutreachUseCase.execute(leadId);

  if (!lead) {
    throw new NotFoundError('Lead not found');
  }

  const snapshot = await getLatestLeadSnapshotForOutreachUseCase.execute(
    leadId,
  );

  if (!snapshot) {
    throw new NotFoundError('Lead snapshot not found');
  }

  const audit = await getAuditByLeadAndSnapshotForOutreachUseCase.execute(
    leadId,
    snapshot.id,
  );

  if (!audit) {
    throw new NotFoundError('Audit not found for latest lead snapshot');
  }

  const signals = await detectSignalsForOutreachUseCase.execute(lead, snapshot);

  const outreach = await generateOutreachUseCase.execute({
    lead,
    snapshot,
    signals,
    audit,
  });

  ok(res, mapOutreachToResponse(outreach), 201);
};

export const getOutreachByLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const outreach = await getOutreachByLeadUseCase.execute(
    req.query.leadId as string,
  );

  if (!outreach) {
    throw new NotFoundError('Outreach not found');
  }

  ok(res, mapOutreachToResponse(outreach));
};
