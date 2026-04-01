import type { OutreachGenerator } from '@signalscout/core';
import { MockOutreachGenerator } from './MockOutreachGenerator.js';
import { OutreachPolishingLayer } from './OutreachPolishingLayer.js';

export const createDefaultOutreachGenerator = (): OutreachGenerator => {
  return new OutreachPolishingLayer(new MockOutreachGenerator());
};
