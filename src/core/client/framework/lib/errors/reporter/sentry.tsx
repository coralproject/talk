import * as Sentry from "@sentry/react";
import React, { FunctionComponent } from "react";

import { ErrorReport, ErrorReporter, User } from "./reporter";

export class SentryErrorReporter implements ErrorReporter {
  public readonly ErrorBoundary?: FunctionComponent;

  constructor(reporterFeedbackPrompt: boolean, dsn: string) {
    // Initialize sentry.
    Sentry.init({ dsn, release: `coral@${process.env.TALK_VERSION}` });
    Sentry.setTag("domain", window.location.host);

    // Initialize the boundary if enabled.

    // NOTE: (wyattjoh) there should be another way to do this better...
    if (reporterFeedbackPrompt) {
      this.ErrorBoundary = function ErrorBoundary({ children }) {
        return (
          <Sentry.ErrorBoundary showDialog>{children}</Sentry.ErrorBoundary>
        );
      };
    }
  }

  public report(err: any): ErrorReport {
    // Capture and report the error to Sentry.
    const id = Sentry.captureException(err);

    return { name: "sentry", id };
  }

  private transformUser(user: User | null): Sentry.User | null {
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username || undefined,
      role: user.role,
    };
  }

  public setUser(user: User | null): void {
    const transformed = this.transformUser(user);
    Sentry.setUser(transformed);
  }
}
