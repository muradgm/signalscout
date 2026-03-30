import type { Request, Response } from 'express';
import type { Lead } from '@signalscout/core';
import { NotFoundError } from '../../common/errors/index.js';
import { ok } from '../../common/responses/index.js';
import {extractParam} from '../../common/utils/extractParam.js';
import {
  createLeadUseCase,
  detectSignalsUseCase,
  getLatestLeadSnapshotUseCase,
  getLeadByIdUseCase,
  listLeadsUseCase,
  refreshLeadSnapshotUseCase,
} from '../../wiring/leads.wiring.js';
import {
  mapLeadSnapshotToResponse,
  mapLeadToResponse,
  mapSignalSetToResponse,
} from './leads.mapper.js';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await createLeadUseCase.execute(req.body);

  ok(res, mapLeadToResponse(lead), 201);
};

export const listLeads = async (_req: Request, res: Response): Promise<void> => {
  const leads = await listLeadsUseCase.execute();

  ok(
    res,
    leads.map((lead: Lead) => mapLeadToResponse(lead)),
  );
};

export const getLeadById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = extractParam(req.params.id);

  const lead = await getLeadByIdUseCase.execute(id);

  if (!lead) {
    throw new NotFoundError('Lead not found');
  }

  ok(res, mapLeadToResponse(lead));
};

export const refreshLeadSnapshot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = extractParam(req.params.id);


  const snapshot = await refreshLeadSnapshotUseCase.execute(id);
  if (!snapshot) {
    throw new NotFoundError('Lead snapshot not found');
  }

  ok(res, mapLeadSnapshotToResponse(snapshot), 201);
};

export const getLeadSignals = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = extractParam(req.params.id);

  const lead = await getLeadByIdUseCase.execute(id);

  if (!lead) {
    throw new NotFoundError('Lead not found');
  }

  const snapshot = await getLatestLeadSnapshotUseCase.execute(id);

  if (!snapshot) {
    throw new NotFoundError('Lead snapshot not found');
  }

  const signals = await detectSignalsUseCase.execute(lead, snapshot);

  if (!signals) {
    throw new NotFoundError('Signals not found');
  }

  ok(res, {
    lead: mapLeadToResponse(lead),
    snapshotId: snapshot.id,
    signals: mapSignalSetToResponse(signals),
  });
};