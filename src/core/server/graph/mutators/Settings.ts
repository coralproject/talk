import GraphContext from "coral-server/graph/context";
import { Tenant } from "coral-server/models/tenant";
import {
  createAnnouncement,
  createWebhookEndpoint,
  deactivateSSOSigningSecret,
  deleteAnnouncement,
  deleteSSOSigningSecret,
  deleteWebhookEndpoint,
  disableFeatureFlag,
  disableWebhookEndpoint,
  enableFeatureFlag,
  enableWebhookEndpoint,
  regenerateSSOKey,
  rotateSSOSigningSecret,
  rotateWebhookEndpointSigningSecret,
  sendSMTPTest,
  update,
  updateWebhookEndpoint,
} from "coral-server/services/tenant";

import {
  GQLCreateAnnouncementInput,
  GQLCreateWebhookEndpointInput,
  GQLDeactivateSSOSigningSecretInput,
  GQLDeleteSSOSigningSecretInput,
  GQLDeleteWebhookEndpointInput,
  GQLDisableWebhookEndpointInput,
  GQLEnableWebhookEndpointInput,
  GQLFEATURE_FLAG,
  GQLRotateSSOSigningSecretInput,
  GQLRotateWebhookEndpointSigningSecretInput,
  GQLUpdateSettingsInput,
  GQLUpdateWebhookEndpointInput,
} from "coral-server/graph/schema/__generated__/types";

import { WithoutMutationID } from "./util";

export const Settings = ({
  mongo,
  redis,
  tenantCache,
  tenant,
  config,
  now,
  mailerQueue,
  user,
}: GraphContext) => ({
  update: (
    input: WithoutMutationID<GQLUpdateSettingsInput>
  ): Promise<Tenant | null> =>
    update(mongo, redis, tenantCache, config, tenant, input.settings),
  // DEPRECATED: deprecated in favour of `rotateSSOSigningSecret`, remove in 6.2.0.
  regenerateSSOKey: (): Promise<Tenant | null> =>
    regenerateSSOKey(mongo, redis, tenantCache, tenant, now),
  rotateSSOSigningSecret: ({ inactiveIn }: GQLRotateSSOSigningSecretInput) =>
    rotateSSOSigningSecret(mongo, redis, tenantCache, tenant, inactiveIn, now),
  deleteSSOSigningSecret: ({ kid }: GQLDeleteSSOSigningSecretInput) =>
    deleteSSOSigningSecret(mongo, redis, tenantCache, tenant, kid),
  deactivateSSOSigningSecret: ({ kid }: GQLDeactivateSSOSigningSecretInput) =>
    deactivateSSOSigningSecret(mongo, redis, tenantCache, tenant, kid, now),
  enableFeatureFlag: (flag: GQLFEATURE_FLAG) =>
    enableFeatureFlag(mongo, redis, tenantCache, tenant, flag),
  disableFeatureFlag: (flag: GQLFEATURE_FLAG) =>
    disableFeatureFlag(mongo, redis, tenantCache, tenant, flag),
  createAnnouncement: (input: GQLCreateAnnouncementInput) =>
    createAnnouncement(mongo, redis, tenantCache, tenant, input),
  deleteAnnouncement: () =>
    deleteAnnouncement(mongo, redis, tenantCache, tenant),
  createWebhookEndpoint: (
    input: WithoutMutationID<GQLCreateWebhookEndpointInput>
  ) =>
    createWebhookEndpoint(
      mongo,
      redis,
      config,
      tenantCache,
      tenant,
      input,
      now
    ),
  enableWebhookEndpoint: (
    input: WithoutMutationID<GQLEnableWebhookEndpointInput>
  ) => enableWebhookEndpoint(mongo, redis, tenantCache, tenant, input.id),
  disableWebhookEndpoint: (
    input: WithoutMutationID<GQLDisableWebhookEndpointInput>
  ) => disableWebhookEndpoint(mongo, redis, tenantCache, tenant, input.id),
  updateWebhookEndpoint: ({
    id,
    ...input
  }: WithoutMutationID<GQLUpdateWebhookEndpointInput>) =>
    updateWebhookEndpoint(mongo, redis, config, tenantCache, tenant, id, input),
  deleteWebhookEndpoint: (
    input: WithoutMutationID<GQLDeleteWebhookEndpointInput>
  ) => deleteWebhookEndpoint(mongo, redis, tenantCache, tenant, input.id),
  rotateWebhookEndpointSigningSecret: (
    input: WithoutMutationID<GQLRotateWebhookEndpointSigningSecretInput>
  ) =>
    rotateWebhookEndpointSigningSecret(
      mongo,
      redis,
      tenantCache,
      tenant,
      input.id,
      input.inactiveIn,
      now
    ),
  testSMTP: () => sendSMTPTest(tenant, user!, mailerQueue),
});
