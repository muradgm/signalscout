import type { Request, Response } from 'express';
import { NotFoundError } from '../../common/errors/index.js';
import { ok } from '../../common/responses/index.js';
import {
  detectSignalsForAuditUseCase,
  generateAuditUseCase,
  getAuditByLeadUseCase,
  getLatestLeadSnapshotForAuditUseCase,
  getLeadByIdForAuditUseCase,
} from '../../wiring/audits.wiring.js';
import { mapAuditToResponse } from './audits.mapper.js';

const validateIdParam = (id: string | string[] | undefined): string => {
  if (typeof id !== 'string' || !id.trim()) {
    throw new NotFoundError('Invalid lead ID');
  }
  return id;
};

export const generateAudit = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const lead = await getLeadByIdForAuditUseCase.execute(validateIdParam(req.params.id));

  if (!lead) {
    throw new NotFoundError('Lead not found');
  }

  const snapshot = await getLatestLeadSnapshotForAuditUseCase.execute(validateIdParam(req.params.id));

  if (!snapshot) {
    throw new NotFoundError('Lead snapshot not found');
  }

  const signals = await detectSignalsForAuditUseCase.execute(lead, snapshot);

  const audit = await generateAuditUseCase.execute({
    lead,
    snapshot,
    signals,
  });

  ok(res, mapAuditToResponse(audit), 201);
};

export const getAuditByLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const audit = await getAuditByLeadUseCase.execute(req.query.leadId as string);

  if (!audit) {
    throw new NotFoundError('Audit not found');
  }

  ok(res, mapAuditToResponse(audit));
};