import {
  Event as SentryEvent,
  Response as SentryResponse,
  Status,
  Transport,
} from "@sentry/types";

/**
 * Fake Transport for sentry that outputs to console.
 */
export class FakeDebugTransport implements Transport {
  public sendEvent(event: SentryEvent): PromiseLike<SentryResponse> {
    // eslint-disable-next-line no-console
    console.debug("sentry event", event);
    return Promise.resolve({
      status: Status.Success,
    });
  }
  public close() {
    return Promise.resolve(true);
  }
}
