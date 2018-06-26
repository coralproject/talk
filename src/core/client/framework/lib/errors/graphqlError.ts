export interface GraphQLErrorItem {
  message: string;
  locations: Array<{
    line: number;
    column: number;
  }>;
}

/**
 * Graphql wraps graphql errors at the network layer.
 */
export default class GraphQLError extends Error {
  // Original error.
  public readonly origin: GraphQLErrorItem[];

  constructor(origin: GraphQLErrorItem[]) {
    super(origin.map(o => o.message).join(" "));

    // Maintains proper stack trace for where our error was thrown.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GraphQLError);
    }
    this.origin = origin;
  }
}
