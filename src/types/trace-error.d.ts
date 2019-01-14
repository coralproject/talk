declare module "trace-error" {
  export default class TraceError extends Error {
    constructor(message: string, ...errors: Error[]);
    public causes(): void;
    public cause(index?: number): void;
  }
}
