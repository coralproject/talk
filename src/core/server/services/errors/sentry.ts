import * as Sentry from "@sentry/node";

import { version } from "coral-common/version";
import logger from "coral-server/logger";

import { ErrorReport, ErrorReporter, ErrorReporterScope } from "./reporter";

interface Context {
  user?: Sentry.User;
  tags: Record<string, string>;
}

export class SentryErrorReporter extends ErrorReporter {
  constructor(dsn: string) {
    // Setup the base error reporter.
    super();

    logger.info({ reporter: "sentry" }, "now configuring error reporter");

    // Initialize sentry.
    Sentry.init({ dsn, release: `coral@${version}` });
  }

  public report(err: any, scope: ErrorReporterScope): ErrorReport {
    // Transform the scope to a sentry scope.
    const context: Context = {
      tags: {},
    };

    // Add the User's ID and role if they are provided.
    if (scope.userID && scope.userRole) {
      context.user = {
        id: scope.userID,
        role: scope.userRole,
      };

      // Add the username to the context if it's available too.
      if (scope.userUsername) {
        context.user.username = scope.userUsername;
      }

      // Add the Tenant's ID to the user if it's provided.
      if (scope.tenantID) {
        context.user.tenant_id = scope.tenantID;
      }
    }

    // Add the Tenant's ID and domain if they are provided.
    if (scope.tenantID && scope.tenantDomain) {
      context.tags.tenantID = scope.tenantID;
      context.tags.domain = scope.tenantDomain;
    }

    // Capture and report the error to Sentry.
    const id = Sentry.captureException(err, context);

    // Return the error report.
    return { name: "sentry", id };
  }
}
