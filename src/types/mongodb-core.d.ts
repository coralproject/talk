declare module "mongodb-core" {
  export interface ParsedConnectionString {
    hosts: string[];
    auth: {};
    options: {};
  }

  export interface ParseConnectionStringOptions {
    /**
     * Whether the parser should translate options back into camelCase after normalization.
     */
    caseTranslate?: boolean;
  }

  /** https://github.com/mongodb-js/mongodb-core/blob/master/lib/uri_parser.js */
  export function parseConnectionString(
    uri: string,
    options?: ParseConnectionStringOptions,
    callback?: (error: Error, result: ParsedConnectionString) => void
  ): void;
  export function parseConnectionString(
    uri: string,
    callback?: (error: Error, result: ParsedConnectionString) => void
  ): void;
}
