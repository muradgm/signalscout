import type {
  ExtractedLeadSnapshotData,
  LeadSnapshotExtractor,
} from '@signalscout/core';
import { fetchHtml } from '../fetch/fetchHtml.js';
import { buildLeadSnapshot } from '../snapshots/buildLeadSnapshot.js';

export class WebsiteLeadSnapshotExtractor implements LeadSnapshotExtractor {
  async extract(url: string): Promise<ExtractedLeadSnapshotData> {
    const { url: finalUrl, html } = await fetchHtml(url);

    return buildLeadSnapshot(html, finalUrl);
  }
}