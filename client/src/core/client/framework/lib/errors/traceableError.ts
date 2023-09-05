class TraceableError extends Error {
  public readonly traceID: string;

  constructor(message: string, traceID: string) {
    super(message);
    this.traceID = traceID;
  }
}

export default TraceableError;
