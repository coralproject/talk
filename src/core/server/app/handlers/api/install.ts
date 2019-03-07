import { Redis } from "ioredis";
import Joi from "joi";
import { Db } from "mongodb";

import { LanguageCode, LOCALES } from "talk-common/helpers/i18n/locales";
import { Omit } from "talk-common/types";
import { validate } from "talk-server/app/request/body";
import { Config } from "talk-server/config";
import { TenantInstalledAlreadyError } from "talk-server/errors";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { LocalProfile } from "talk-server/models/user";
import { IndexerQueue } from "talk-server/queue/tasks/indexer";
import { install, InstallTenant } from "talk-server/services/tenant";
import { upsert, UpsertUser } from "talk-server/services/users";
import { RequestHandler } from "talk-server/types/express";

export interface TenantInstallBody {
  tenant: Omit<InstallTenant, "domain" | "locale"> & {
    locale: LanguageCode | null;
  };
  user: Required<Pick<UpsertUser, "username" | "email"> & { password: string }>;
}

const TenantInstallBodySchema = Joi.object().keys({
  tenant: Joi.object()
    .keys({
      organizationName: Joi.string().trim(),
      organizationURL: Joi.string()
        .trim()
        .uri(),
      organizationContactEmail: Joi.string()
        .trim()
        .lowercase()
        .email(),
      domains: Joi.array().items(
        Joi.string()
          .trim()
          .uri()
      ),
      locale: Joi.string()
        .default(null)
        .valid(LOCALES),
    })
    .optionalKeys("locale"),
  user: Joi.object().keys({
    username: Joi.string().trim(),
    password: Joi.string(),
    email: Joi.string()
      .trim()
      .lowercase()
      .email(),
  }),
});

export interface TenantInstallHandlerOptions {
  redis: Redis;
  mongo: Db;
  indexerQueue: IndexerQueue;
  config: Config;
}

export const installHandler = ({
  mongo,
  redis,
  indexerQueue,
  config,
}: TenantInstallHandlerOptions): RequestHandler => async (req, res, next) => {
  try {
    if (!req.talk) {
      return next(new Error("talk was not set"));
    }

    if (!req.talk.cache) {
      return next(new Error("cache was not set"));
    }

    if (req.talk.tenant) {
      // There's already a Tenant on the request! No need to process further.
      return next(new TenantInstalledAlreadyError());
    }

    // Validate that the payload passed in was correct, it will throw if the
    // payload is invalid.
    const {
      tenant: { locale: tenantLocale, ...tenantInput },
      user: userInput,
    }: TenantInstallBody = validate(TenantInstallBodySchema, req.body);

    // Default the locale to the default locale if not provided.
    let locale = tenantLocale;
    if (!locale) {
      locale = config.get("default_locale") as LanguageCode;
    }

    // Install will throw if it can not create a Tenant, or it has already been
    // installed.
    const tenant = await install(mongo, redis, req.talk.cache.tenant, {
      ...tenantInput,
      // Infer the Tenant domain via the hostname parameter.
      domain: req.hostname,
      // Add the locale that we had to default to the default locale from the
      // config.
      locale,
    });

    // Pull the user details out of the input for the user.
    const { email, username, password } = userInput;

    // Configure with profile.
    const profile: LocalProfile = {
      type: "local",
      id: email,
      password,
    };

    // Create the first admin user.
    await upsert(mongo, indexerQueue, tenant, {
      email,
      username,
      profiles: [profile],
      role: GQLUSER_ROLE.ADMIN,
    });

    // Send back the Tenant.
    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};
