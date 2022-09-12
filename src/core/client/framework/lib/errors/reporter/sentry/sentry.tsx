import { Dedupe, RewriteFrames, Transaction } from "@sentry/integrations";
import * as Sentry from "@sentry/react";
import React, { FunctionComponent } from "react";

import { ensureNoStartSlash, getOrigin } from "coral-common/utils";
import supportedBrowsersRegExp from "coral-framework/helpers/supportedBrowsersRegExp";

import {
  ErrorReport,
  ErrorReporter,
  ErrorReporterScope,
  User,
} from "../reporter";
import { FakeDebugTransport } from "./fakeDebugTransport";

declare const __webpack_public_path__: string;

/**
 * getAppFilename transforms a filename like http://localhost:8080/assets/js/embed.js to
 * app:///assets/js/embed.js for sentry.
 */
export function getAppFilename(
  filename: string,
  // eslint-disable-next-line no-restricted-globals
  location = window.location.toString(),
  publicPath = __webpack_public_path__
): string {
  // Only assets need an `app://` uri.
  if (!filename.includes("/assets/")) {
    return filename;
  }
  if (publicPath === "/") {
    const origin = getOrigin(location);
    if (filename.includes(origin)) {
      const pathname = new URL(filename).pathname;
      return `app:///static/${ensureNoStartSlash(pathname)}`;
    }
  } else if (filename.startsWith(publicPath)) {
    const remaining = filename.substr(publicPath.length);
    return `app:///static/${ensureNoStartSlash(remaining)}`;
  }
  return filename;
}

export class SentryErrorReporter implements ErrorReporter {
  public readonly ErrorBoundary?: FunctionComponent<{
    children?: React.ReactNode;
  }>;

  constructor(
    reporterFeedbackPrompt: boolean,
    dsn: string,
    options: {
      offlineDebug?: boolean;
    } = {}
  ) {
    // Whitelist current origin.
    // eslint-disable-next-line no-restricted-globals
    const whitelistUrls = [getOrigin(window.location.toString())];

    // Also add STATIC_URI if it's being used (e.g. cdn)
    if (__webpack_public_path__ !== "/") {
      whitelistUrls.push(__webpack_public_path__);
    }

    // Initialize sentry.
    Sentry.init({
      dsn,
      release: `coral@${process.env.TALK_VERSION}`,
      debug: Boolean(options.offlineDebug),
      transport: options.offlineDebug ? FakeDebugTransport : undefined,
      allowUrls: whitelistUrls,
      sampleRate: 0.2,
      beforeSend: (event) => {
        // Drop all events if query string includes `fbclid` string
        // See: https://github.com/getsentry/sentry-javascript/issues/1811.
        if (location.search.indexOf("fbclid") !== -1) {
          return null;
        }
        // Drop non supported legacy browsers.
        if (!supportedBrowsersRegExp.test(navigator.userAgent)) {
          return null;
        }
        // Otherwise just let it through.
        return event;
      },
      integrations: [
        ...Sentry.defaultIntegrations.map((i) => {
          if (
            process.env.NODE_ENV !== "production" &&
            i.name === "Breadcrumbs"
          ) {
            // Prevent overwriting global `console` during development and test.
            return new Sentry.Integrations.Breadcrumbs({ console: false });
          }
          return i;
        }),
        new RewriteFrames({
          iteratee: (frame) => {
            if (frame.filename) {
              frame.filename = getAppFilename(frame.filename);
            }
            return frame;
          },
        }),
        // Include dedupe only in production.
        ...(process.env.NODE_ENV === "production" ? [new Dedupe()] : []),
        new Transaction(),
      ],
    });

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

  public report(err: any, scope: ErrorReporterScope = {}): ErrorReport {
    // Turn to error to have stacktrace information.
    if (typeof err === "string") {
      err = new Error(err);
    }

    // eslint-disable-next-line no-restricted-globals
    Sentry.setTag("domain", window.location.host);

    // Capture and report the error to Sentry.
    const contexts: Record<string, Record<string, unknown>> = {};
    if (scope.componentStack) {
      // Like how Sentry does: https://github.com/getsentry/sentry-javascript/blob/master/packages/react/src/errorboundary.tsx
      contexts.react = {
        componentStack: scope.componentStack,
      };
    }

    const id = Sentry.captureException(err, {
      contexts,
    });

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
