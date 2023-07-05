import { Redis } from "ioredis";
import { DateTime } from "luxon";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import {
  createTenantWebhookEndpoint,
  CreateTenantWebhookEndpointInput,
  deleteTenantWebhookEndpoint,
  getWebhookEndpoint,
  rotateTenantWebhookEndpointSigningSecret,
  Tenant,
  updateTenantWebhookEndpoint,
  UpdateTenantWebhookEndpointInput,
} from "coral-server/models/tenant";

import { GQLWEBHOOK_EVENT_NAME } from "coral-server/graph/schema/__generated__/types";

import { TenantCache } from "./cache";

interface WebhookEndpointInput {
  url: string;
  all: boolean;
  events: GQLWEBHOOK_EVENT_NAME[];
}

export function validateWebhookEndpointInput(
  config: Config,
  input: WebhookEndpointInput
) {
  // Check to see that this URL is valid and has a https:// scheme if in
  // production mode.
  const url = new URL(input.url);
  if (config.get("env") === "production" && url.protocol !== "https:") {
    throw new Error(`invalid scheme provided in production: ${url.protocol}`);
  }

  // Ensure that either the "all" or "events" is provided but not both.
  if (input.all && input.events.length > 0) {
    throw new Error("both all events and specific events were requested");
  }
}

export async function createWebhookEndpoint(
  mongo: MongoContext,
  redis: Redis,
  config: Config,
  cache: TenantCache,
  tenant: Tenant,
  input: CreateTenantWebhookEndpointInput,
  now: Date
) {
  // Validate the input.
  validateWebhookEndpointInput(config, input);

  // Looks good in create this, send it off to be created.
  const result = await createTenantWebhookEndpoint(
    mongo,
    tenant.id,
    input,
    now
  );
  if (!result.tenant) {
    throw new Error("could not create the tenant endpoint, tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, result.tenant);

  return {
    endpoint: result.endpoint,
    settings: result.tenant,
  };
}

export async function updateWebhookEndpoint(
  mongo: MongoContext,
  redis: Redis,
  config: Config,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string,
  input: UpdateTenantWebhookEndpointInput
) {
  // Find the endpoint.
  let endpoint = getWebhookEndpoint(tenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  // Extract the input.
  const {
    url = endpoint.url,
    all = endpoint.all,
    events = endpoint.events,
  } = input;

  // Validate the input.
  validateWebhookEndpointInput(config, {
    url,
    all,
    events,
  });

  const updatedTenant = await updateTenantWebhookEndpoint(
    mongo,
    tenant.id,
    endpointID,
    input
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated endpoint.
  endpoint = getWebhookEndpoint(updatedTenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  return endpoint;
}

export async function enableWebhookEndpoint(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string
) {
  // Find the endpoint.
  let endpoint = getWebhookEndpoint(tenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  // Endpoint is already enabled.
  if (endpoint.enabled === true) {
    return endpoint;
  }

  const updatedTenant = await updateTenantWebhookEndpoint(
    mongo,
    tenant.id,
    endpointID,
    { enabled: true }
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated endpoint.
  endpoint = getWebhookEndpoint(updatedTenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  return endpoint;
}

export async function disableWebhookEndpoint(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string
) {
  // Find the endpoint.
  let endpoint = getWebhookEndpoint(tenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  // Endpoint is already disabled.
  if (endpoint.enabled === false) {
    return endpoint;
  }

  const updatedTenant = await updateTenantWebhookEndpoint(
    mongo,
    tenant.id,
    endpointID,
    { enabled: false }
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated endpoint.
  endpoint = getWebhookEndpoint(updatedTenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  return endpoint;
}

export async function deleteWebhookEndpoint(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string
) {
  // Find the endpoint.
  const endpoint = getWebhookEndpoint(tenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  const updatedTenant = await deleteTenantWebhookEndpoint(
    mongo,
    tenant.id,
    endpointID
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return endpoint;
}

export async function rotateWebhookEndpointSigningSecret(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string,
  inactiveIn: number,
  now: Date
) {
  // Find the endpoint.
  let endpoint = getWebhookEndpoint(tenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }
  if (inactiveIn < 0 || inactiveIn > 86400) {
    throw new Error(`invalid inactiveIn passed: ${inactiveIn}`);
  }

  // Compute the inactiveAt dates for the current active secrets.
  const inactiveAt =
    inactiveIn === 0
      ? now
      : DateTime.fromJSDate(now).plus({ seconds: inactiveIn }).toJSDate();

  // Rotate the secrets.
  const updatedTenant = await rotateTenantWebhookEndpointSigningSecret(
    mongo,
    tenant.id,
    endpointID,
    inactiveAt,
    now
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated endpoint.
  endpoint = getWebhookEndpoint(updatedTenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  return endpoint;
}
