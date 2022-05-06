import {
  Event as SentryEvent,
  EventStatus,
  Response as SentryResponse,
  Transport,
} from "@sentry/types";

import logger from "coral-server/logger";

/**
 * Fake Transport for sentry that outputs to the logger.
 */
export class FakeDebugTransport implements Transport {
  public sendEvent(event: SentryEvent): PromiseLike<SentryResponse> {
    logger.debug(
      { reporter: "sentry" },
      "sentry event",
      JSON.stringify(event, null, 2)
    );

    return Promise.resolve({
      // This type keeps changing with each new version of Sentry,
      // so I'm casting this to ensure we're checking this status
      // value is correct. Previously, it was a `Status.Success` strongly
      // typed Enum, now it's just a generic TS `type`, so we have
      // to cast the string to get any real type information. This
      // will ensure this throws an error if it changes and we can check the
      // type value when that happens to make sure it's accurate.
      status: "success" as EventStatus,
    });
  }
  public close() {
    return Promise.resolve(true);
  }
}
