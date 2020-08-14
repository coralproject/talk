import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export interface ErrorReporterScope {
  tenantID?: string;
  tenantDomain?: string;
  userID?: string;
  userRole?: GQLUSER_ROLE;
  ipAddress?: string;
}

export interface ErrorReport {
  name: string;
  id: string;
}

export abstract class ErrorReporter {
  public abstract report(err: any, scope: ErrorReporterScope): ErrorReport;
}
