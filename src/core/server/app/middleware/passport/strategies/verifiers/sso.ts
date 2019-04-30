import Joi from "joi";
import { isNil } from "lodash";
import { Db } from "mongodb";

import { validate } from "talk-server/app/request/body";
import { IntegrationDisabled } from "talk-server/errors";
import {
  GQLSSOAuthIntegration,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import { retrieveUserWithProfile, SSOProfile } from "talk-server/models/user";
import { insert } from "talk-server/services/users";

import { SymmetricSigningAlgorithm, verifyJWT } from "talk-server/services/jwt";
import { Verifier } from "../jwt";

export interface SSOStrategyOptions {
  mongo: Db;
}

export interface SSOUserProfile {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface SSOToken {
  user: SSOUserProfile;
}

export const SSOUserProfileSchema = Joi.object()
  .keys({
    id: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
    avatar: Joi.string().default(undefined),
    displayName: Joi.string().default(undefined),
  })
  .optionalKeys(["avatar", "displayName"]);

export const SSOTokenSchema = Joi.object().keys({
  user: SSOUserProfileSchema.required(),
});

export async function findOrCreateSSOUser(
  mongo: Db,
  tenant: Tenant,
  integration: GQLSSOAuthIntegration,
  token: SSOToken,
  now = new Date()
) {
  if (!token.user) {
    // TODO: (wyattjoh) replace with better error.
    throw new Error("token is malformed, missing user claim");
  }

  // Unpack/validate the token content.
  const { id, email, username, avatar }: SSOUserProfile = validate(
    SSOUserProfileSchema,
    token.user
  );

  const profile: SSOProfile = {
    type: "sso",
    id,
  };

  // Try to lookup user given their id provided in the `sub` claim.
  let user = await retrieveUserWithProfile(mongo, tenant.id, profile);
  if (!user) {
    if (!integration.allowRegistration) {
      // Registration is disabled, so we can't create the user user here.
      return null;
    }

    // FIXME: (wyattjoh) implement rules! Not all users should be able to create an account via this method.

    // Create the new user, as one didn't exist before!
    user = await insert(
      mongo,
      tenant,
      {
        username,
        role: GQLUSER_ROLE.COMMENTER,
        email,
        avatar,
        profiles: [profile],
      },
      now
    );
  }

  // TODO: (wyattjoh) possibly update the user profile if the remaining details mismatch?

  return user;
}

export function isSSOToken(token: SSOToken | object): token is SSOToken {
  const { error } = Joi.validate(token, SSOTokenSchema);
  return isNil(error);
}

export interface SSOVerifierOptions {
  mongo: Db;
}

export class SSOVerifier implements Verifier<SSOToken> {
  private mongo: Db;

  constructor({ mongo }: SSOVerifierOptions) {
    this.mongo = mongo;
  }

  public supports(token: SSOToken | object, tenant: Tenant): token is SSOToken {
    return tenant.auth.integrations.sso.enabled && isSSOToken(token);
  }

  public async verify(
    tokenString: string,
    token: SSOToken,
    tenant: Tenant,
    now: Date
  ) {
    const integration = tenant.auth.integrations.sso;
    if (!integration.enabled) {
      throw new IntegrationDisabled("sso");
    }

    if (!integration.key) {
      throw new Error("integration key does not exist");
    }

    verifyJWT(
      tokenString,
      {
        // Force the use of the HS256 algorithm. We can explore switching this
        // out in the future..
        // TODO: (wyattjoh) investigate replacing algorithm.
        algorithm: SymmetricSigningAlgorithm.HS256,
        secret: integration.key,
      },
      now
    );

    return findOrCreateSSOUser(this.mongo, tenant, integration, token, now);
  }
}
