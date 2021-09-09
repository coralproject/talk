/**
 * ErrorReporterScope are additional information that
 * can be sent with the errors.
 */
export interface ErrorReporterScope {
  componentStack?: string;
}

/**
 * ErrorReport is the report to be provided by the error reporter when an error
 * is reported.
 */
export interface ErrorReport {
  /**
   * name is used to identify the specific error reporter that captured the
   * report.
   */
  name: string;

  /**
   * id is identifier sent by the error reporter associated with this error
   * report.
   */
  id: string;
}

export interface User {
  id?: string;
  username?: string | null;
  role?: string;
}

export interface ErrorReporter {
  /**
   * report will send a report to the reporter service.
   *
   * @param err the error to report
   */
  report(err: any, scope?: ErrorReporterScope): ErrorReport;

  /**
   * setUser should set the user that's currently interacting with the
   * application.
   *
   * @param user the current logged in user or null for none.
   */
  setUser(user: User | null): void;

  /**
   * ErrorBoundary is the optional component that this reporter provides to catch
   * and display errors to the user.
   */
  readonly ErrorBoundary?: React.ComponentType;
}
