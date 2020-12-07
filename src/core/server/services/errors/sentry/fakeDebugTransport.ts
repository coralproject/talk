import {
  Event as SentryEvent,
  Response as SentryResponse,
  Status,
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
      status: Status.Success,
    });
  }
  public close() {
    return Promise.resolve(true);
  }
}
