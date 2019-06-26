import Joi from "joi";
import { isNull } from "lodash";
import { DateTime } from "luxon";
import { Db } from "mongodb";
import uuid from "uuid";

import { Config } from "coral-server/config";
import {
  createInvite,
  CreateInviteInput,
  Invite,
  redeemInvite,
  redeemInviteFromEmail,
  retrieveInvite,
} from "coral-server/models/invite";
import { Tenant } from "coral-server/models/tenant";
import {
  insertUser,
  LocalProfile,
  retrieveUserWithEmail,
  User,
} from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import {
  JWTSigningConfig,
  signString,
  StandardClaims,
  StandardClaimsSchema,
  verifyJWT,
} from "coral-server/services/jwt";

import { constructTenantURL } from "coral-server/app/url";
import {
  IntegrationDisabled,
  InviteTokenExpired,
  TokenInvalidError,
} from "coral-server/errors";
import { validateEmail, validatePassword, validateUsername } from "../helpers";

export interface InviteToken extends Required<StandardClaims> {
  // aud specifies `invite` as the audience to indicate that this is an invite
  // token.
  aud: "invite";

  /**
   * email is the email address being confirmed.
   */
  email: string;
}

const InviteTokenSchema = StandardClaimsSchema.keys({
  aud: Joi.string().only("invite"),
  email: Joi.string().email(),
});

export function validateInviteToken(token: InviteToken | object): Error | null {
  const { error } = Joi.validate(token, InviteTokenSchema, {
    presence: "required",
  });
  return error || null;
}

export function isInviteToken(
  token: InviteToken | object
): token is InviteToken {
  return isNull(validateInviteToken(token));
}

export async function generateInviteURL(
  tenant: Tenant,
  config: Config,
  signingConfig: JWTSigningConfig,
  user: Required<Pick<Invite, "id" | "email">>,
  now: Date
) {
  // Pull some stuff out of the user.
  const { id } = user;

  // Change the JS Date to a DateTime for ease of use.
  const nowDate = DateTime.fromJSDate(now);
  const nowSeconds = Math.round(nowDate.toSeconds());

  // The expiry of this token is linked as 1 week after issuance.
  const expiresAt = Math.round(nowDate.plus({ weeks: 1 }).toSeconds());

  // Generate a token.
  const inviteToken: InviteToken = {
    jti: uuid.v4(),
    iss: tenant.id,
    sub: id,
    exp: expiresAt,
    iat: nowSeconds,
    nbf: nowSeconds,
    aud: "invite",
    email: user.email,
  };

  // Sign it with the signing config.
  const token = await signString(signingConfig, inviteToken);

  // Generate the invite url.
  return constructTenantURL(
    config,
    tenant,
    // TODO: (kiwi) verify that url is correct.
    `/account/invite#inviteToken=${token}`
  );
}

export async function verifyInviteTokenString(
  mongo: Db,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  tokenString: string,
  now: Date
) {
  const token = verifyJWT(tokenString, signingConfig, now, {
    // Verify that the token is for this Tenant.
    issuer: tenant.id,
    // Verify that this is a confirm token based on the audience.
    audience: "invite",
  });

  // Validate that this is indeed a reset token.
  if (!isInviteToken(token)) {
    // TODO: (wyattjoh) look into a way of pulling the error into this one
    throw new TokenInvalidError(
      tokenString,
      "does not conform to the invite token schema"
    );
  }

  // Unpack some of the token.
  const { sub: inviteID, iss } = token;

  if (iss !== tenant.id) {
    throw new TokenInvalidError(tokenString, "invalid tenant");
  }

  // Verify that the invite is still valid.
  const inv = await retrieveInvite(mongo, tenant.id, inviteID);
  if (!inv) {
    throw new InviteTokenExpired("invite not found");
  }

  // Now that we've verified that the token is valid, we're good to go!
  return token;
}

export type InviteUser = CreateInviteInput;

export async function invite(
  mongo: Db,
  tenant: Tenant,
  config: Config,
  mailerQueue: MailerQueue,
  signingConfig: JWTSigningConfig,
  { email, ...user }: InviteUser,
  invitingUser: User,
  now = new Date()
) {
  if (
    !tenant.auth.integrations.local.enabled ||
    !tenant.auth.integrations.local.allowRegistration ||
    !tenant.auth.integrations.local.targetFilter.admin
  ) {
    // TODO: (wyattjoh) investigate throwing a different error for when the target filter is turned off for admin
    throw new IntegrationDisabled("local");
  }

  // Validate the user payload.
  validateEmail(email);

  // Ensure the email address is lowercase.
  email = email.toLowerCase();

  // Check to see if the user with the specified email already has an account.
  const userAlready = await retrieveUserWithEmail(mongo, tenant.id, email);
  if (userAlready) {
    return null;
  }

  // Check to see that the user has not been invited before, if they have,
  // redeem it and create a new one.
  await redeemInviteFromEmail(mongo, tenant.id, email);

  // Create the User invite record.
  const invitedNow = await createInvite(
    mongo,
    tenant.id,
    {
      ...user,
      email,
    },
    invitingUser.id,
    now
  );

  // Generate the invite URL.
  const inviteURL = await generateInviteURL(
    tenant,
    config,
    signingConfig,
    invitedNow,
    now
  );

  // Send the invited user an email with the invite token.
  await mailerQueue.add({
    template: {
      name: "invite",
      context: {
        organizationName: tenant.organization.name,
        organizationURL: tenant.organization.url,
        inviteURL,
      },
    },
    tenantID: tenant.id,
    message: {
      to: email,
    },
  });

  return invitedNow;
}

export interface RedeemInvite {
  username: string;
  password: string;
}

export async function redeem(
  mongo: Db,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  tokenString: string,
  { username, password }: RedeemInvite,
  now: Date
) {
  if (
    !tenant.auth.integrations.local.enabled ||
    !tenant.auth.integrations.local.allowRegistration ||
    !tenant.auth.integrations.local.targetFilter.admin
  ) {
    // TODO: (wyattjoh) investigate throwing a different error for when the target filter is turned off for admin
    throw new IntegrationDisabled("local");
  }

  // Verify the local user data.
  validateUsername(username);
  validatePassword(password);

  // Verify that the token is valid.
  const { sub: inviteID } = await verifyInviteTokenString(
    mongo,
    tenant,
    signingConfig,
    tokenString,
    now
  );

  // Redeem the invite from the database.
  const { role, email } = await redeemInvite(mongo, tenant.id, inviteID);

  // Configure the login profile.
  const profile: LocalProfile = {
    id: email,
    type: "local",
    password,
  };

  // Create the new user based on the invite.
  const user = await insertUser(
    mongo,
    tenant.id,
    {
      username,
      email,
      emailVerified: true, // Verified because the invite link was clicked.
      profiles: [profile],
      role,
    },
    now
  );

  return user;
}
