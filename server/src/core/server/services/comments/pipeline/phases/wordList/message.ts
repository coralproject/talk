import { LanguageCode } from "coral-common/common/lib/helpers";
import { WordlistMatch } from "coral-server/models/comment";

export enum MessageType {
  Initialize = "initialize",
  Process = "process",
}

export enum WordListCategory {
  Banned = "banned",
  Suspect = "suspect",
}

export interface WordListWorkerMessage {
  id: string;
  type: MessageType;
  data: any;
}

export interface InitializationPayload {
  tenantID: string;
  category: WordListCategory;
  locale: LanguageCode;
  phrases: string[];
}

export interface ProcessPayload {
  tenantID: string;
  category: WordListCategory;
  testString: string;
}

export interface WordListWorkerResult {
  id: string;
  tenantID: string;
  ok?: boolean;
  err?: Error;
  data?: any;
}

export interface WordListMatchResult {
  isMatched: boolean;
  matches: WordlistMatch[];
  timedOut?: boolean;
}
