export interface CountJSONPData {
  ref: string;
  html: string;
  count: number;
  seenCount?: number | null;
  id?: string | null;
}

export interface PreviousCountData {
  count: number;
  expiresAt: number;
}
