import { Redis } from "ioredis";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { CoralEventPayload } from "coral-server/events/event";
import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { filterExpiredSigningSecrets } from "coral-server/models/settings";
import {
  deleteTenantWebhookEndpointSigningSecrets,
  getWebhookEndpoint,
} from "coral-server/models/tenant";
import { JobProcessor } from "coral-server/queue/Task";
import { createFetch, generateFetchOptions } from "coral-server/services/fetch";
import { disableWebhookEndpoint } from "coral-server/services/tenant";
import { TenantCache } from "coral-server/services/tenant/cache";

export const JOB_NAME = "webhook";

// The count of failures on a webhook delivery before we disable the endpoint.
const MAXIMUM_FAILURE_COUNT = 10;

// The number of webhook attempts that should be retained for debugging.
const MAXIMUM_EVENT_ATTEMPTS_LOG_SIZE = 50;

export interface WebhookProcessorOptions {
  config: Config;
  mongo: MongoContext;
  redis: Redis;
  tenantCache: TenantCache;
}

export interface WebhookData {
  contextID: string;
  endpointID: string;
  tenantID: string;
  event: CoralEventPayload;
}

export interface WebhookDelivery {
  id: string;
  name: string;
  success: boolean;
  status: number;
  statusText: string;
  request: string;
  response: string;
  createdAt: Date;
}

interface CoralWebhookEventPayload extends CoralEventPayload {
  /**
   * tenantID is the ID of the Tenant that this event originated at.
   */
  readonly tenantID: string;

  /**
   * tenantDomain is the domain that is associated with this Tenant that this event originated at.
   */
  readonly tenantDomain: string;
}

export function createJobProcessor({
  mongo,
  tenantCache,
  redis,
}: WebhookProcessorOptions): JobProcessor<WebhookData> {
  // Create the fetcher that will orchestrate sending the actual webhooks.
  const fetch = createFetch({ name: "Webhook" });

  return async (job) => {
    const { tenantID, endpointID, contextID, event } = job.data;

    const log = logger.child(
      {
        eventID: event.id,
        contextID,
        jobID: job.id,
        jobName: JOB_NAME,
        tenantID,
        endpointID,
      },
      true
    );

    // Get the referenced tenant so we can get the endpoint details.
    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    // Get the referenced endpoint.
    const endpoint = getWebhookEndpoint(tenant, endpointID);
    if (!endpoint) {
      log.error("referenced endpoint was not found");
      return;
    }

    // If the endpoint is disabled, don't bother processing it.
    if (!endpoint.enabled) {
      log.warn("endpoint was disabled, skipping sending");
      return;
    }

    // Get the current date.
    const now = new Date();

    // Generate the payload.
    const payload: CoralWebhookEventPayload = {
      ...event,
      tenantID,
      tenantDomain: tenant.domain,
    };

    // Get the fetch options.
    const options = generateFetchOptions(endpoint.signingSecrets, payload, now);

    // Add the X-Coral-Event header.
    options.headers = {
      ...options.headers,
      "X-Coral-Event": event.type,
    };

    // Send the request.
    const timer = createTimer();
    const res = await fetch(endpoint.url, options);
    if (res.ok) {
      log.info(
        { took: timer(), responseStatus: res.status },
        "finished sending webhook"
      );
    } else {
      log.warn(
        { took: timer(), responseStatus: res.status },
        "failed to deliver webhook"
      );
    }

    // Grab the response from the webhook, we'll want to save this in the recent
    // attempts.
    const response = await res.text();

    // Collect the delivery information.
    const delivery: WebhookDelivery = {
      id: event.id,
      name: event.type,
      success: res.ok,
      status: res.status,
      statusText: res.statusText,
      // We only serialize the body as a string.
      request: options.body as string,
      response,
      createdAt: new Date(),
    };

    // Record the delivery.
    const endpointDeliveriesKey = `${tenantID}:endpointDeliveries:${endpointID}`;
    const endpointFailuresKey = `${tenantID}:endpointFailures:${endpointID}`;
    let [, , [, failuresString]] = await redis
      .multi()
      // Push the attempt into the list.
      .rpush(endpointDeliveriesKey, JSON.stringify(delivery))
      // Trim the list to the 50 most recent attempts.
      .ltrim(endpointDeliveriesKey, 0, MAXIMUM_EVENT_ATTEMPTS_LOG_SIZE - 1)
      // Get the current failure count.
      .get(endpointFailuresKey)
      // Execute the queued operations.
      .exec();

    let failures = failuresString ? parseInt(failuresString, 10) : null;
    if (res.ok && failures && failures > 0) {
      // The webhook delivery was a success, and there were previous failures.
      // Remove the failures record.
      await redis.del(endpointFailuresKey);
    } else if (!res.ok) {
      // Record the failed attempt.
      failuresString = await redis.incr(endpointFailuresKey);

      // If the failure count is higher than the allowed maximum, disable the
      // endpoint.
      failures = failuresString ? parseInt(failuresString, 10) : null;
      if (failures && failures >= MAXIMUM_FAILURE_COUNT) {
        log.warn(
          { failures, maxFailures: MAXIMUM_FAILURE_COUNT },
          "maximum failures reached, disabling endpoint"
        );

        await disableWebhookEndpoint(
          mongo,
          redis,
          tenantCache,
          tenant,
          endpointID
        );
      }
      // TODO: (wyattjoh) maybe schedule a retry?
    }

    // Remove the expired secrets in the next tick so that it does not affect
    // the sending performance of this job, and errors do not impact the
    // sending.
    const expiredSigningSecretKIDs = endpoint.signingSecrets
      .filter(filterExpiredSigningSecrets(now))
      .map((s) => s.kid);
    if (expiredSigningSecretKIDs.length > 0) {
      process.nextTick(() => {
        deleteTenantWebhookEndpointSigningSecrets(
          mongo,
          tenantID,
          endpoint.id,
          expiredSigningSecretKIDs
        )
          .then(() => {
            log.info(
              { endpointID: endpoint.id, kids: expiredSigningSecretKIDs },
              "removed expired secrets from endpoint"
            );
          })
          .catch((err) => {
            log.error(
              { err },
              "an error occurred when trying to remove expired endpoint secrets"
            );
          });
      });
    }
  };
}
