export interface CountJSONPData {
  ref: string;
  countHtml: string;
  textHtml: string;
  count: number;
  id?: string | null;
}

export interface PreviousCountData {
  count: number;
  expiresAt: number;
}
