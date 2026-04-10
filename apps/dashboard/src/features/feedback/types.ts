export type LabeledCount = {
  label: string;
  count: number;
};

export type ReviewSegment = {
  total: number;
  acceptedRate: number;
  editedRate: number;
  skippedRate: number;
};

export type OutreachLearningSummary = {
  windowSize: number;
  totalReviewed: number;
  acceptedRate: number;
  editedRate: number;
  skippedRate: number;
  subjectEditedRate: number;
  bodyEditedRate: number;
  multilingualShare: number;
  specialtyShare: number;
  topAngles: LabeledCount[];
  topEditedAngles: LabeledCount[];
  topNiches: LabeledCount[];
  topEditedNiches: LabeledCount[];
  reviewSegments: {
    nonBerlin: ReviewSegment;
    weakSurface: ReviewSegment;
    specialty: ReviewSegment;
    multilingual: ReviewSegment;
  };
};
