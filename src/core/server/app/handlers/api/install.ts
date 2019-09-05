import Joi from "joi";
import uuid from "uuid/v4";

import { LanguageCode, LOCALES } from "coral-common/helpers/i18n/locales";
import { Omit } from "coral-common/types";
import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { TenantInstalledAlreadyError } from "coral-server/errors";
import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";
import { LocalProfile } from "coral-server/models/user";
import { install, InstallTenant } from "coral-server/services/tenant";
import { insert, InsertUser } from "coral-server/services/users";
import { RequestHandler } from "coral-server/types/express";

export interface TenantInstallBody {
  tenant: Omit<InstallTenant, "domain" | "locale"> & {
    locale: LanguageCode | null;
  };
  user: Required<Pick<InsertUser, "username" | "email"> & { password: string }>;
}

const TenantInstallBodySchema = Joi.object().keys({
  tenant: Joi.object()
    .keys({
      organization: Joi.object().keys({
        name: Joi.string().trim(),
        url: Joi.string()
          .trim()
          .uri(),
        contactEmail: Joi.string()
          .trim()
          .lowercase()
          .email(),
      }),
      allowedDomains: Joi.array().items(
        Joi.string()
          .trim()
          .uri({ scheme: ["http", "https"] })
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

export type TenantInstallHandlerOptions = Pick<
  AppOptions,
  "redis" | "mongo" | "config" | "mailerQueue" | "i18n"
>;

export const installHandler = ({
  mongo,
  redis,
  config,
  i18n,
}: TenantInstallHandlerOptions): RequestHandler => async (req, res, next) => {
  try {
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
    await insert(
      mongo,
      tenant,
      {
        email,
        username,
        profiles: [profile],
        role: GQLUSER_ROLE.ADMIN,
      },
      req.coral.now
    );

    // Send back the Tenant.
    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};
