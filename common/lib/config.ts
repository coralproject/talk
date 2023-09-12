import {
  EmbedBootstrapConfig as EBC,
  ReporterConfig as RC,
  SentryReporterConfig as SRC,
  StaticConfig as SC,
} from "coral-config/config";

export interface SentryReporterConfig extends SRC {}

export type ReporterConfig = RC;

export interface StaticConfig extends SC {}

export interface EmbedBootstrapConfig extends EBC {}
