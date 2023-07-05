import { Redis } from "ioredis";
import { DateTime } from "luxon";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { getExternalModerationPhase } from "coral-server/models/settings";
import {
  createTenantExternalModerationPhase,
  CreateTenantExternalModerationPhaseInput,
  deleteTenantExternalModerationPhase,
  rotateTenantExternalModerationPhaseSigningSecret,
  Tenant,
  updateTenantExternalModerationPhase,
  UpdateTenantExternalModerationPhaseInput,
} from "coral-server/models/tenant";

import { TenantCache } from "./cache";

interface ExternalModerationPhaseInput {
  url: string;
  timeout: number;
}

export function validateExternalModerationPhaseInput(
  config: Config,
  input: ExternalModerationPhaseInput
) {
  // Check to see that this URL is valid and has a https:// scheme if in
  // production mode.
  const url = new URL(input.url);
  if (config.get("env") === "production" && url.protocol !== "https:") {
    throw new Error(`invalid scheme provided in production: ${url.protocol}`);
  }

  // Check to see if the timeout value is within range.
  if (input.timeout < 100) {
    throw new Error("timeout value too low");
  } else if (input.timeout > 10000) {
    throw new Error("timeout value too high");
  }
}

export async function createExternalModerationPhase(
  mongo: MongoContext,
  redis: Redis,
  config: Config,
  cache: TenantCache,
  tenant: Tenant,
  input: CreateTenantExternalModerationPhaseInput,
  now: Date
) {
  // Validate the input.
  validateExternalModerationPhaseInput(config, input);

  // Looks good in create this, send it off to be created.
  const result = await createTenantExternalModerationPhase(
    mongo,
    tenant.id,
    input,
    now
  );
  if (!result.tenant) {
    throw new Error("could not create the tenant phase, tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, result.tenant);

  return {
    phase: result.phase,
    settings: result.tenant,
  };
}

export async function updateExternalModerationPhase(
  mongo: MongoContext,
  redis: Redis,
  config: Config,
  cache: TenantCache,
  tenant: Tenant,
  phaseID: string,
  input: UpdateTenantExternalModerationPhaseInput
) {
  // Find the phase.
  if (!tenant.integrations.external) {
    throw new Error(
      "referenced phase was not found on tenant, none configured"
    );
  }

  let phase = getExternalModerationPhase(tenant.integrations.external, phaseID);
  if (!phase) {
    throw new Error("referenced phase was not found on tenant");
  }

  // Extract the input.
  const { url = phase.url, timeout = phase.timeout } = input;

  // Validate the input.
  validateExternalModerationPhaseInput(config, {
    url,
    timeout,
  });

  const updatedTenant = await updateTenantExternalModerationPhase(
    mongo,
    tenant.id,
    phaseID,
    input
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated phase.
  phase = getExternalModerationPhase(
    // We know that `external` is provided because we already verified it earlier.
    updatedTenant.integrations.external!,
    phaseID
  );
  if (!phase) {
    throw new Error("referenced phase was not found on tenant");
  }

  return phase;
}

export async function deleteExternalModerationPhase(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  phaseID: string
) {
  // Find the phase.
  if (!tenant.integrations.external) {
    throw new Error(
      "referenced phase was not found on tenant, none configured"
    );
  }
  const phase = getExternalModerationPhase(
    tenant.integrations.external,
    phaseID
  );
  if (!phase) {
    throw new Error("referenced phase was not found on tenant");
  }

  const updatedTenant = await deleteTenantExternalModerationPhase(
    mongo,
    tenant.id,
    phaseID
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return phase;
}

export async function enableExternalModerationPhase(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  phaseID: string
) {
  // Find the phase.
  if (!tenant.integrations.external) {
    throw new Error(
      "referenced phase was not found on tenant, none configured"
    );
  }

  let phase = getExternalModerationPhase(tenant.integrations.external, phaseID);
  if (!phase) {
    throw new Error("referenced phase was not found on tenant");
  }

  // Phase is already enabled.
  if (phase.enabled === true) {
    return phase;
  }

  const updatedTenant = await updateTenantExternalModerationPhase(
    mongo,
    tenant.id,
    phaseID,
    { enabled: true }
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated phase.
  phase = getExternalModerationPhase(
    // We know that `external` is provided because we already verified it earlier.
    updatedTenant.integrations.external!,
    phaseID
  );
  if (!phase) {
    throw new Error("referenced phase was not found on tenant");
  }

  return phase;
}

export async function disableExternalModerationPhase(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  phaseID: string
) {
  // Find the phase.
  if (!tenant.integrations.external) {
    throw new Error(
      "referenced phase was not found on tenant, none configured"
    );
  }
  let phase = getExternalModerationPhase(tenant.integrations.external, phaseID);
  if (!phase) {
    throw new Error("referenced phase was not found on tenant");
  }

  // Phase is already disabled.
  if (phase.enabled === false) {
    return phase;
  }

  const updatedTenant = await updateTenantExternalModerationPhase(
    mongo,
    tenant.id,
    phaseID,
    { enabled: false }
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated phase.
  phase = getExternalModerationPhase(
    // We know that `external` is provided because we already verified it earlier.
    updatedTenant.integrations.external!,
    phaseID
  );
  if (!phase) {
    throw new Error("referenced phase was not found on tenant");
  }

  return phase;
}

export async function rotateExternalModerationPhaseSigningSecret(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  phaseID: string,
  inactiveIn: number,
  now: Date
) {
  // Find the phase.
  if (!tenant.integrations.external) {
    throw new Error(
      "referenced phase was not found on tenant, none configured"
    );
  }
  let phase = getExternalModerationPhase(tenant.integrations.external, phaseID);
  if (!phase) {
    throw new Error("referenced phase was not found on tenant");
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
  const updatedTenant = await rotateTenantExternalModerationPhaseSigningSecret(
    mongo,
    tenant.id,
    phaseID,
    inactiveAt,
    now
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated endpoint.
  phase = getExternalModerationPhase(
    // We know that `external` is provided because we already verified it earlier.
    updatedTenant.integrations.external!,
    phaseID
  );
  if (!phase) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  return phase;
}
