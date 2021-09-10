import getStaticConfig from "coral-framework/lib/getStaticConfig";

import { ErrorReporter } from "./reporter";
import { SentryErrorReporter } from "./sentry";

interface Options {
  /**
   * reporterPrompt when true will ensure that the reporters error boundary
   * element is configured if the reporter supports it to collect user feedback.
   */
  reporterFeedbackPrompt?: boolean;
}

function createDevelopmentReporter() {
  return new SentryErrorReporter(false, "http://debug@debug/1", {
    offlineDebug: true,
  });
}

function createReporter(
  window: Window,
  { reporterFeedbackPrompt = false }: Options = {}
): ErrorReporter | undefined {
  // Parse and load the reporter configuration from the config element on the
  // page.
  const config = getStaticConfig(window);
  if (!config) {
    if (process.env.NODE_ENV === "development") {
      return createDevelopmentReporter();
    }
    return;
  }

  // If no reporter is configured, we don't have to do anything, or
  // use a custom reporter during development.
  if (!config.reporter) {
    if (process.env.NODE_ENV === "development") {
      return createDevelopmentReporter();
    }
    return;
  }

  // Based on the reporter's name, create the reporter.
  switch (config.reporter.name) {
    case "sentry":
      return new SentryErrorReporter(
        reporterFeedbackPrompt,
        config.reporter.dsn
      );
    default:
      // We're in a part of the code where we're creating an error reporter, so
      // if we have problems with that, instead of throwing which wouldn't be
      // too helpful, let's just log it out instead.

      // eslint-disable-next-line no-console
      console.error(`Unsupported error reporter: ${config.reporter.name}`);
      return;
  }
}

export default createReporter;
