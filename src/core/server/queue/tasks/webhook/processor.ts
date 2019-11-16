import crypto from "crypto";
import http from "http";
import https from "https";
import { Redis } from "ioredis";
import { Db } from "mongodb";
import fetch, { RequestInit } from "node-fetch";
import now from "performance-now";
import uuid from "uuid/v4";

import { version } from "coral-common/version";
import { Config } from "coral-server/config";
import logger from "coral-server/logger";
import { JobProcessor } from "coral-server/queue/Task";
import { disableEndpoint } from "coral-server/services/tenant";
import TenantCache from "coral-server/services/tenant/cache";

export const JOB_NAME = "webhook";

// FIXME: (wyattjoh) validate that this failure count is correct
const MAXIMUM_FAILURE_COUNT = 10;

export interface WebhookProcessorOptions {
  config: Config;
  mongo: Db;
  redis: Redis;
  tenantCache: TenantCache;
}

// FIXME: (wyattjoh) replace this with a more concrete type (based on subscription types maybe?)
interface EventData {
  id: string;
}

export interface WebhookData<T extends EventData = any> {
  eventName: string;
  eventData: T;
  endpointID: string;
  tenantID: string;
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

export interface WebhookPayload<T extends EventData = any> {
  id: string;
  name: string;
  data: T;
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
    .digest();
}

export function generateFetchOptions<T extends EventData>(
  secret: string,
  agents: Agents,
  data: WebhookPayload<T>
): RequestInit {
  // Serialize the body and signature to include in the request.
  const body = JSON.stringify(data, null, 2);
  const signature = generateSignature(secret, body);
  const signatureString = `sha256=${signature.toString(
    "hex"
  )},sha256=${signature.toString("hex")}`;

  const headers: Record<string, any> = {
    "User-Agent": `Coral Webhook/${version}`,
    "Content-Type": "application/json",
    "X-Coral-Event": data.name,
    "X-Coral-Signature": signatureString,
  };

  return {
    method: "POST",
    agent: url => (url.protocol === "http:" ? agents.http : agents.https),
    headers,
    body,
  };
}

interface Agents {
  http: http.Agent;
  https: https.Agent;
}

export function createJobProcessor({
  mongo,
  tenantCache,
  redis,
}: WebhookProcessorOptions): JobProcessor<WebhookData> {
  // Create HTTP agents to improve connection performance.
  const agents: Agents = {
    https: new https.Agent({
      keepAlive: true,
    }),
    http: new http.Agent({
      keepAlive: true,
    }),
  };

  return async job => {
    const { tenantID, endpointID, eventName, eventData } = job.data;

    let log = logger.child(
      {
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

    // Prepare the payload.
    const payload: WebhookPayload = {
      id: uuid(),
      name: eventName,
      data: eventData,
      createdAt: new Date(),
    };

    // Send the request.
    const options = generateFetchOptions(
      endpoint.signingSecret,
      agents,
      payload
    );

    const startedSendingAt = now();
    const res = await fetch(endpoint.url, options);
    const took = now() - startedSendingAt;

    log = log.child({ deliveryID: payload.id }, true);

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
      id: payload.id,
      name: eventName,
      success: res.ok,
      status: res.status,
      statusText: res.statusText,
      // We only serialize the body as a string.
      request: options.body as string,
      response,
      createdAt: payload.createdAt,
    };

    // Record the delivery.
    const endpointDeliveriesKey = `${tenantID}:endpointDeliveries:${endpointID}`;
    const endpointFailuresKey = `${tenantID}:endpointFailures:${endpointID}`;
    let [, , [, failuresString]] = await redis
      .multi()
      // Push the attempt into the list.
      .rpush(endpointDeliveriesKey, JSON.stringify(delivery))
      // Trim the list to the 50 most recent attempts.
      .ltrim(endpointDeliveriesKey, 0, 49)
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
        // TODO: (wyattjoh) maybe schedule a retry
      }
    }
  };
}
