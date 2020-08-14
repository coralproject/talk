import Sentry, { User } from "@sentry/node";

import { ErrorReport, ErrorReporter, ErrorReporterScope } from "./reporter";

interface Context {
  user: User;
  tags: Record<string, string>;
}

export class SentryErrorReporter extends ErrorReporter {
  public readonly name = "sentry";

  constructor(dsn: string) {
    // Setup the base error reporter.
    super();

    // Initialize sentry.
    Sentry.init({ dsn });
  }

  public report(err: any, scope: ErrorReporterScope): ErrorReport {
    // Transform the scope to a sentry scope.
    const context: Context = {
      user: {
        id: scope.userID,
        role: scope.userRole,
      },
      tags: {},
    };

    // Add the Tenant's ID and domain if they are provided.
    if (scope.tenantID && scope.tenantDomain) {
      context.tags.tenantID = scope.tenantID;
      context.tags.tenantDomain = scope.tenantDomain;
    }

    // Capture and report the error to Sentry.
    const id = Sentry.captureException(err, context);

    // Return the error report.
    return {
      name: "sentry",
      id,
    };
  }
}
