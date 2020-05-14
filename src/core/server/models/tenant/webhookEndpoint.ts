import { Redis } from "ioredis";
import { isEmpty } from "lodash";
import { Db } from "mongodb";
import uuid from "uuid/v4";

import { dotize } from "coral-common/utils/dotize";
import { tenants as collection } from "coral-server/services/mongodb/collections";

import { GQLWEBHOOK_EVENT_NAME } from "coral-server/graph/schema/__generated__/types";

import { generateSecret, rollSecret } from "../settings";
import { getWebhookEndpoint } from "./helpers";
import { Endpoint, retrieveTenant } from "./tenant";

export async function rollTenantWebhookEndpointSecret(
  mongo: Db,
  id: string,
  endpointID: string,
  inactiveAt: Date,
  now: Date
) {
  return rollSecret({
    collection: collection(mongo),
    filter: { id },
    path: "webhooks.endpoints",
    prefix: "whsec",
    id: endpointID,
    inactiveAt,
    now,
  });
}
export interface CreateTenantWebhookEndpointInput {
  url: string;
  all: boolean;
  events: GQLWEBHOOK_EVENT_NAME[];
}

export async function createTenantWebhookEndpoint(
  mongo: Db,
  id: string,
  input: CreateTenantWebhookEndpointInput,
  now: Date
) {
  // Create the new endpoint.
  const endpoint: Endpoint = {
    ...input,
    id: uuid(),
    enabled: true,
    signingSecrets: [generateSecret("whsec", now)],
    createdAt: now,
  };

  // Update the Tenant with this new endpoint.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    { $push: { "webhooks.endpoints": endpoint } },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const tenant = await retrieveTenant(mongo, id);
    if (!tenant) {
      return {
        endpoint: null,
        tenant: null,
      };
    }

    throw new Error("update failed for an unexpected reason");
  }

  return {
    endpoint,
    tenant: result.value,
  };
}

export interface UpdateTenantWebhookEndpointInput {
  enabled?: boolean;
  url?: string;
  all?: boolean;
  events?: GQLWEBHOOK_EVENT_NAME[];
}

export async function updateTenantWebhookEndpoint(
  mongo: Db,
  id: string,
  endpointID: string,
  update: UpdateTenantWebhookEndpointInput
) {
  const $set = dotize(
    { "webhooks.endpoints.$[endpoint]": update },
    { embedArrays: true }
  );

  // Check to see if there is any updates that will be made.
  if (isEmpty($set)) {
    // No updates need to be made, abort here and just return the tenant.
    return retrieveTenant(mongo, id);
  }

  // Perform the actual update operation.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    { $set },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
      arrayFilters: [{ "endpoint.id": endpointID }],
    }
  );
  if (!result.value) {
    const tenant = await retrieveTenant(mongo, id);
    if (!tenant) {
      return null;
    }

    const endpoint = getWebhookEndpoint(tenant, endpointID);
    if (!endpoint) {
      throw new Error(
        `endpoint not found with id: ${endpointID} on tenant: ${id}`
      );
    }

    throw new Error("update failed for an unexpected reason");
  }

  return result.value;
}

export async function deleteEndpointSecrets(
  mongo: Db,
  id: string,
  endpointID: string,
  kids: string[]
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $pull: {
        "webhooks.endpoints.$[endpoint].signingSecrets": { kid: { $in: kids } },
      },
    },
    { returnOriginal: false, arrayFilters: [{ "endpoint.id": endpointID }] }
  );
  if (!result.value) {
    const tenant = await retrieveTenant(mongo, id);
    if (!tenant) {
      return null;
    }

    const endpoint = getWebhookEndpoint(tenant, endpointID);
    if (!endpoint) {
      throw new Error(
        `endpoint not found with id: ${endpointID} on tenant: ${id}`
      );
    }

    throw new Error("update failed for an unexpected reason");
  }

  return result.value;
}

export async function deleteTenantWebhookEndpoint(
  mongo: Db,
  id: string,
  endpointID: string
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $pull: {
        "webhooks.endpoints": { id: endpointID },
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const tenant = await retrieveTenant(mongo, id);
    if (!tenant) {
      return null;
    }

    throw new Error("update failed for an unexpected reason");
  }

  return result.value;
}

function lastUsedAtTenantSSOKey(id: string): string {
  return `${id}:lastUsedSSOKey`;
}

/**
 * updateLastUsedAtTenantSSOKey will update the time stamp that the SSO key was
 * last used at.
 *
 * @param redis the Redis connection to use to update the timestamp on
 * @param id the ID of the Tenant
 * @param kid the kid of the token that was used
 * @param when the date that the token was last used at
 */
export async function updateLastUsedAtTenantSSOKey(
  redis: Redis,
  id: string,
  kid: string,
  when: Date
) {
  await redis.hset(lastUsedAtTenantSSOKey(id), kid, when.toISOString());
}

/**
 *
 * @param redis the Redis connection to use to remove the last used on.
 * @param id the ID of the Tenant
 * @param kid the kid of the token that is being deleted
 */
export async function deleteLastUsedAtTenantSSOKey(
  redis: Redis,
  id: string,
  kid: string
) {
  await redis.hdel(lastUsedAtTenantSSOKey(id), kid);
}

/**
 * retrieveLastUsedAtTenantSSOKeys will get the dates that the requested sso
 * keys were last used on.
 *
 * @param redis the Redis connection to use to update the timestamp on
 * @param id the ID of the Tenant
 * @param kids the kids of the tokens that we want to know when they were last used
 */
export async function retrieveLastUsedAtTenantSSOKeys(
  redis: Redis,
  id: string,
  kids: string[]
) {
  const results: Array<string | null> = await redis.hmget(
    lastUsedAtTenantSSOKey(id),
    ...kids
  );

  return results.map(lastUsedAt => {
    if (!lastUsedAt) {
      return null;
    }

    return new Date(lastUsedAt);
  });
}
