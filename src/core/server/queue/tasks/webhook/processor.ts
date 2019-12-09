import crypto from "crypto";
import { Redis } from "ioredis";
import { Db } from "mongodb";
import getNow from "performance-now";

import { Config } from "coral-server/config";
import { CoralEventPayload } from "coral-server/events/event";
import logger from "coral-server/logger";
import {
  filterActiveSecrets,
  filterExpiredSecrets,
} from "coral-server/models/settings";
import { deleteEndpointSecrets, Endpoint } from "coral-server/models/tenant";
import { JobProcessor } from "coral-server/queue/Task";
import { createFetch, FetchOptions } from "coral-server/services/fetch";
import { disableEndpoint } from "coral-server/services/tenant";
import TenantCache from "coral-server/services/tenant/cache";

export const JOB_NAME = "webhook";

// The count of failures on a webhook delivery before we disable the endpoint.
const MAXIMUM_FAILURE_COUNT = 10;

// The number of webhook attempts that should be retained for debugging.
const MAXIMUM_EVENT_ATTEMPTS_LOG_SIZE = 50;

export interface WebhookProcessorOptions {
  config: Config;
  mongo: Db;
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

/**
 * generateSignature will generate a signature used to assist clients to
 * validate that the request came from Coral.
 *
 * @param secret the secret used to sign the body with
 * @param body the body to use when signing
 */
export function generateSignature(secret: string, body: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest()
    .toString("hex");
}

export function generateSignatures(
  endpoint: Pick<Endpoint, "signingSecrets">,
  body: string,
  now: Date
) {
  // For each of the signatures, we only want to sign the body with secrets that
  // are still active.
  return endpoint.signingSecrets
    .filter(filterActiveSecrets(now))
    .map(({ secret }) => generateSignature(secret, body))
    .map(signature => `sha256=${signature}`)
    .join(",");
}

export function generateFetchOptions(
  endpoint: Pick<Endpoint, "signingSecrets">,
  data: CoralEventPayload,
  now: Date
): FetchOptions {
  // Serialize the body and signature to include in the request.
  const body = JSON.stringify(data, null, 2);
  const signature = generateSignatures(endpoint, body, now);

  const headers: Record<string, any> = {
    "Content-Type": "application/json",
    "X-Coral-Event": data.type,
    "X-Coral-Signature": signature,
  };

  return {
    method: "POST",
    headers,
    body,
  };
}

export function createJobProcessor({
  mongo,
  tenantCache,
  redis,
}: WebhookProcessorOptions): JobProcessor<WebhookData> {
  // Create the fetcher that will orchestrate sending the actual webhooks.
  const fetch = createFetch({ name: "Webhook" });

  return async job => {
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
    const endpoint = tenant.webhooks.endpoints.find(
      ({ id }) => id === endpointID
    );
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

    // Get the fetch options.
    const options = generateFetchOptions(endpoint, event, now);

    // Send the request.
    const startedSendingAt = getNow();
    const res = await fetch(endpoint.url, options);
    const took = getNow() - startedSendingAt;
    if (res.ok) {
      log.info(
        { took, responseStatus: res.status },
        "finished sending webhook"
      );
    } else {
      log.warn(
        { took, responseStatus: res.status },
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

        await disableEndpoint(mongo, redis, tenantCache, tenant, endpointID);
      } else {
        // TODO: (wyattjoh) maybe schedule a retry?
      }
    }

    // Remove the expired secrets in the next tick so that it does not affect
    // the sending performance of this job, and errors do not impact the
    // sending.
    const expiredSigningSecrets = endpoint.signingSecrets.filter(
      filterExpiredSecrets(now)
    );
    if (expiredSigningSecrets.length > 0) {
      process.nextTick(() => {
        deleteEndpointSecrets(
          mongo,
          tenantID,
          endpoint.id,
          expiredSigningSecrets.map(s => s.kid)
        )
          .then(() => {
            log.info(
              { secrets: expiredSigningSecrets.length },
              "removed expired secrets from endpoint"
            );
          })
          .catch(err => {
            log.error(
              { err },
              "an error occurred when trying to remove expired secrets"
            );
          });
      });
    }
  };
}
