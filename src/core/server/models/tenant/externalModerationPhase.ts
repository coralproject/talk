import { isEmpty } from "lodash";
import { Db } from "mongodb";
import uuid from "uuid/v4";

import { dotize } from "coral-common/utils/dotize";
import { tenants as collection } from "coral-server/services/mongodb/collections";

import { GQLCOMMENT_BODY_FORMAT } from "coral-server/graph/schema/__generated__/types";

import {
  ExternalModerationPhase,
  generateSigningSecret,
  getExternalModerationPhase,
  rotateSigningSecret,
} from "../settings";
import { retrieveTenant } from "./tenant";

export async function rotateTenantExternalModerationPhaseSigningSecret(
  mongo: Db,
  id: string,
  phaseID: string,
  inactiveAt: Date,
  now: Date
) {
  return rotateSigningSecret({
    collection: collection(mongo),
    filter: { id },
    path: "integrations.external.phases",
    id: phaseID,
    prefix: "empsec",
    inactiveAt,
    now,
  });
}

export interface CreateTenantExternalModerationPhaseInput {
  url: string;
  format: GQLCOMMENT_BODY_FORMAT;
  timeout: number;
}

export async function createTenantExternalModerationPhase(
  mongo: Db,
  id: string,
  input: CreateTenantExternalModerationPhaseInput,
  now: Date
) {
  // Create the new phase.
  const phase: ExternalModerationPhase = {
    ...input,
    id: uuid(),
    enabled: true,
    signingSecrets: [generateSigningSecret("empsec", now)],
    createdAt: now,
  };

  // Update the Tenant with this new phase.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    { $push: { "integrations.custom.phases": phase } },
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
        phase: null,
        tenant: null,
      };
    }

    throw new Error("update failed for an unexpected reason");
  }

  return {
    phase,
    tenant: result.value,
  };
}

export interface UpdateTenantExternalModerationPhaseInput {
  enabled?: boolean;
  url?: string;
  format?: GQLCOMMENT_BODY_FORMAT;
  timeout?: number;
}

export async function updateTenantExternalModerationPhase(
  mongo: Db,
  id: string,
  phaseID: string,
  update: UpdateTenantExternalModerationPhaseInput
) {
  const $set = dotize(
    { "integrations.custom.phases.$[phase]": update },
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
      arrayFilters: [{ "phase.id": phaseID }],
    }
  );
  if (!result.value) {
    const tenant = await retrieveTenant(mongo, id);
    if (!tenant) {
      return null;
    }

    if (!tenant.integrations.custom) {
      throw new Error(`phase not found with id: ${phaseID} on tenant: ${id}`);
    }

    const endpoint = getExternalModerationPhase(
      tenant.integrations.custom,
      phaseID
    );
    if (!endpoint) {
      throw new Error(`phase not found with id: ${phaseID} on tenant: ${id}`);
    }

    throw new Error("update failed for an unexpected reason");
  }

  return result.value;
}

export async function deleteTenantExternalModerationPhase(
  mongo: Db,
  id: string,
  phaseID: string
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $pull: {
        "integrations.custom.phases": { id: phaseID },
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
