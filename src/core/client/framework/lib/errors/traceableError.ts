class TraceableError extends Error {
  public readonly traceID: string;
}

export default TraceableError;
