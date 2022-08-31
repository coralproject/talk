export interface CountJSONPData {
  ref: string;
  html: string;
  count: number;
  id?: string | null;
}

export interface PreviousCountData {
  count: number;
  expiresAt: number;
}
