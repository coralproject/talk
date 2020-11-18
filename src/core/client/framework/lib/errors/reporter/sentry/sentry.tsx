import * as Sentry from "@sentry/react";
import React, { FunctionComponent } from "react";

import { ErrorReport, ErrorReporter, User } from "../reporter";
import { FakeDebugTransport } from "./fakeDebugTransport";

export class SentryErrorReporter implements ErrorReporter {
  public readonly ErrorBoundary?: FunctionComponent;

  constructor(
    reporterFeedbackPrompt: boolean,
    dsn: string,
    options: {
      offlineDebug?: boolean;
    } = {}
  ) {
    // Initialize sentry.
    Sentry.init({
      dsn,
      release: `coral@${process.env.TALK_VERSION}`,
      debug: Boolean(options.offlineDebug),
      transport: options.offlineDebug ? FakeDebugTransport : undefined,
      beforeSend: (event) => {
        // Drop all events if query string includes `fbclid` string
        // See: https://github.com/getsentry/sentry-javascript/issues/1811.
        if (location.search.indexOf("fbclid") !== -1) {
          return null;
        }
        // Otherwise just let it through
        return event;
      },
    });
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
    // Turn to error to have stacktrace information.
    if (typeof err === "string") {
      err = new Error(err);
    }

    // Capture and report the error to Sentry.
    const id = Sentry.captureException(err);

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(err);
    }

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
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("sentry set user", transformed);
    }
    Sentry.setUser(transformed);
  }
}
