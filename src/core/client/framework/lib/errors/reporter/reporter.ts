export interface ErrorReport {
  name: string;
  id: string;
}

export interface User {
  id?: string;
  username?: string | null;
  role?: string;
}

export abstract class ErrorReporter {
  /**
   * report will send a report to the reporter service.
   *
   * @param err the error to report
   */
  public abstract report(err: any): ErrorReport;

  /**
   * setUser should set the user that's currently interacting with the
   * application.
   *
   * @param user the current logged in user or null for none.
   */
  public abstract setUser(user: User | null): void;

  /**
   * ErrorBoundry is the optional component that this reporter provides to catch
   * and display errors to the user.
   */
  public abstract readonly ErrorBoundry?: React.ComponentType;
}
