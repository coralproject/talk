export interface CountJSONPData {
  ref: string;
  html: string;
  count: number;
  id?: string | null;
  showNew?: boolean;
}

export interface PreviousCountData {
  count: number;
  expiresAt: number;
}
