import { RewriteFrames, Transaction } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import path from "path";

import { version } from "coral-common/version";
import { CoralError } from "coral-server/errors";
import logger from "coral-server/logger";

import { ErrorReport, ErrorReporter, ErrorReporterScope } from "../reporter";
import { FakeDebugTransport } from "./fakeDebugTransport";

interface Context {
  user?: Sentry.User;
  tags: Record<string, string>;
}

// Return underlying cause of error if any otherwise return the error itself.
function getErrorToReport(err: Error): Error {
  const ret = (err instanceof CoralError && err.cause()) || err;
  if (ret !== err) {
    return getErrorToReport(ret);
  }
  return err;
}

export class SentryErrorReporter extends ErrorReporter {
  constructor(
    dsn: string,
    options: {
      offlineDebug?: boolean;
    } = {}
  ) {
    // Setup the base error reporter.
    super();

    const logData: any = { reporter: "sentry" };
    if (options.offlineDebug) {
      logData.offlineDebug = true;
    }
    logger.info(logData, "now configuring error reporter");

    // Initialize sentry.
    Sentry.init({
      dsn,
      release: `coral@${version}`,
      debug: Boolean(options.offlineDebug),
      sampleRate: 0.2,
      transport: options.offlineDebug ? FakeDebugTransport : undefined,
      integrations: [
        ...Sentry.defaultIntegrations,
        new RewriteFrames({
          root: path.join(process.cwd(), "src"),
        }),
        new Transaction(),
      ],
    });
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

    // Get the original cause of the error in case that it is wrapped.
    const errorToReport = getErrorToReport(err);

    // Capture and report the error to Sentry.
    const id = Sentry.captureException(errorToReport, context);

    // Return the error report.
    return { name: "sentry", id };
  }
}
