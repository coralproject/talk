import { CoralError } from "coral-server/errors";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export interface ErrorReporterScope {
  tenantID?: string;
  tenantDomain?: string;
  userID?: string;
  userUsername?: string;
  userRole?: GQLUSER_ROLE;
  ipAddress?: string;
}

export interface ErrorReport {
  name: string;
  id: string;
}

export abstract class ErrorReporter {
  /**
   * shouldReport will return if a particular error should be reported to the
   * reporter.
   *
   * @param err the error to test if it should be reported or not.
   */
  public shouldReport(err: any): boolean {
    if (!(err instanceof CoralError)) {
      // The error isn't a CoralError, so send it!
      return true;
    }

    // The error is a CoralError, so check to see if we should not report it.
    return err.reportable;
  }

  public abstract report(err: any, scope?: ErrorReporterScope): ErrorReport;
}
