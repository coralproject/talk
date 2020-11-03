import Joi from "joi";
import { v4 as uuid } from "uuid";

import { LanguageCode, LOCALES } from "coral-common/helpers/i18n/locales";
import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { Config } from "coral-server/config";
import {
  InstallationForbiddenError,
  TenantInstalledAlreadyError,
} from "coral-server/errors";
import { CreateSiteInput } from "coral-server/models/site";
import { LocalProfile } from "coral-server/models/user";
import {
  createJWTSigningConfig,
  extractTokenFromRequest,
  JWTSigningConfig,
} from "coral-server/services/jwt";
import { verifyInstallationTokenString } from "coral-server/services/management";
import { create as createSite } from "coral-server/services/sites";
import {
  install,
  InstallTenant,
  isInstalled,
} from "coral-server/services/tenant";
import { create, CreateUser } from "coral-server/services/users";
import {
  CoralRequest,
  Request,
  RequestHandler,
} from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export type TenantInstallCheckHandlerOptions = Pick<
  AppOptions,
  "redis" | "config"
>;

export const installCheckHandler = ({
  config,
  redis,
}: TenantInstallCheckHandlerOptions): RequestHandler<CoralRequest> => {
  const { managementEnabled, signingConfig } = managementSigningConfig(config);
  const limiter = new RequestLimiter({
    redis,
    ttl: "10s",
    max: 2,
    prefix: "ip",
    config,
  });

  return async (req, res, next) => {
    try {
      // Limit based on the IP address.
      await limiter.test(req, req.ip);

      // Pull the tenant out.
      const { tenant, cache } = req.coral;

      // If there's already a Tenant on the request! No need to process further.
      if (tenant) {
        return next(new TenantInstalledAlreadyError());
      }

      // Check to see if the server already has a tenant installed.
      const alreadyInstalled = await isInstalled(cache.tenant);
      if (!alreadyInstalled) {
        // No tenants are installed at all, we can of course proceed with the
        // install now.
        return res.sendStatus(204);
      }

      // Check to see if management is enabled for this server.
      if (managementEnabled && signingConfig) {
        await checkForInstallationToken(req, signingConfig);

        // We've determined that there is already a tenant installed on this
        // server, but we have a valid management token, so we're good!
        return res.sendStatus(204);
      }

      return next(new TenantInstalledAlreadyError());
    } catch (err) {
      return next(err);
    }
  };
};

export interface TenantInstallBody {
  tenant: Omit<InstallTenant, "domain" | "locale"> & {
    locale: LanguageCode | null;
  };
  site: Omit<CreateSiteInput, "tenantID">;
  user: Required<Pick<CreateUser, "username" | "email"> & { password: string }>;
}

const TenantInstallBodySchema = Joi.object().keys({
  tenant: Joi.object().keys({
    organization: Joi.object().keys({
      name: Joi.string().trim(),
      url: Joi.string().trim().uri(),
      contactEmail: Joi.string().trim().lowercase().email(),
    }),
    locale: Joi.string()
      .default(null)
      .valid(...LOCALES)
      .optional(),
  }),
  site: Joi.object().keys({
    name: Joi.string().trim(),
    allowedOrigins: Joi.array().items(
      Joi.string()
        .trim()
        .uri({ scheme: ["http", "https"] })
    ),
  }),
  user: Joi.object().keys({
    username: Joi.string().trim(),
    password: Joi.string(),
    email: Joi.string().trim().lowercase().email(),
  }),
});

export type TenantInstallHandlerOptions = Pick<
  AppOptions,
  "redis" | "mongo" | "config" | "mailerQueue" | "i18n" | "migrationManager"
>;

export const installHandler = ({
  mongo,
  redis,
  config,
  i18n,
  migrationManager,
}: TenantInstallHandlerOptions): RequestHandler => {
  const { managementEnabled, signingConfig } = managementSigningConfig(config);
  const limiter = new RequestLimiter({
    redis,
    ttl: "10s",
    max: 1,
    prefix: "ip",
    config,
  });

  return async (req, res, next) => {
    try {
      // Limit based on the IP address.
      await limiter.test(req, req.ip);

      if (!req.coral) {
        return next(new Error("coral was not set"));
      }

      if (!req.coral.cache) {
        return next(new Error("cache was not set"));
      }

      if (req.coral.tenant) {
        // There's already a Tenant on the request! No need to process further.
        return next(new TenantInstalledAlreadyError());
      }

      // Check to see if the server already has a tenant installed.
      let alreadyInstalled = await isInstalled(req.coral.cache.tenant);

      // Check to see if management is enabled for this server.
      if (managementEnabled && signingConfig) {
        // Management is enabled for this server, check now if the server already
        // has a tenant installed.
        if (alreadyInstalled) {
          await checkForInstallationToken(req, signingConfig);

          // We've determined that there is at least one tenant already
          // installed, and we've verified that the current call to install
          // this tenant came with a signed token that was signed by the
          // management secret, so we can safely mark that this tenant is
          // indeed, not already been installed.
          alreadyInstalled = false;
        }
      }

      // Guard against installs trying to install multiple tenants when management
      // hasn't been enabled.
      if (alreadyInstalled) {
        return next(new TenantInstalledAlreadyError());
      }

      // Validate that the payload passed in was correct, it will throw if the
      // payload is invalid.
      const {
        tenant: { locale: tenantLocale, ...tenantInput },
        site: siteInput,
        user: userInput,
      }: TenantInstallBody = validate(TenantInstallBodySchema, req.body);

      // Default the locale to the default locale if not provided.
      let locale = tenantLocale;
      if (!locale) {
        locale = config.get("default_locale") as LanguageCode;
      }

      // Execute the pending migrations now, as the schema and types are already
      // current for the new tenant being installed now. No point in creating
      // a tenant when migrations have not been ran yet.
      await migrationManager.executePendingMigrations(mongo, redis, true);

      // Install will throw if it can not create a Tenant, or it has already been
      // installed.
      const tenant = await install(
        mongo,
        redis,
        req.coral.cache.tenant,
        i18n,
        {
          ...tenantInput,
          // Infer the Tenant domain via the hostname parameter.
          domain: req.hostname,
          // Add the locale that we had to default to the default locale from the
          // config.
          locale,
        },
        req.coral.now
      );

      await createSite(mongo, tenant, siteInput);

      // Pull the user details out of the input for the user.
      const { email, username, password } = userInput;

      // Configure with profile.
      const profile: LocalProfile = {
        type: "local",
        id: email,
        password,
        passwordID: uuid(),
      };

      // Create the first admin user.
      await create(
        mongo,
        tenant,
        {
          email,
          username,
          profile,
          role: GQLUSER_ROLE.ADMIN,
        },
        {},
        req.coral.now
      );

      // Send back the Tenant.
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};

async function checkForInstallationToken(
  req: Request,
  signingConfig: JWTSigningConfig
) {
  // The server already has another tenant installed. Every additional
  // tenant must be installed via the signed domain method. Check to see
  // now if the given domain is signed.
  const accessToken = extractTokenFromRequest(req, true);
  if (accessToken) {
    // Verify the JWT on the request to ensure it was signed by the
    // management secret.
    const { token } = await verifyInstallationTokenString(
      signingConfig,
      accessToken,
      req.coral.now
    );

    // Check to see that the domain on the token matches the hostname on
    // the request.
    if (req.hostname !== token.sub) {
      throw new InstallationForbiddenError(req.hostname);
    }
  } else {
    throw new InstallationForbiddenError(req.hostname);
  }
}

function managementSigningConfig(config: Config) {
  const managementSigningSecret = config.get("management_signing_secret");
  const managementSigningAlgorithm = config.get("management_signing_algorithm");
  const managementEnabled = Boolean(managementSigningSecret);
  const signingConfig = managementSigningSecret
    ? createJWTSigningConfig(
        managementSigningSecret,
        managementSigningAlgorithm
      )
    : null;
  return { managementEnabled, signingConfig };
}
