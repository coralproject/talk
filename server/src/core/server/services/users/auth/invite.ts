import Joi from "joi";
import { isNull, uniq } from "lodash";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import { constructTenantURL } from "coral-server/app/url";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import {
  IntegrationDisabled,
  InviteIncludesExistingUser,
  InviteRequiresEmailAddresses,
  InviteTokenExpired,
  TokenInvalidError,
} from "coral-server/errors";
import {
  createInvite,
  Invite,
  redeemInvite,
  redeemInviteFromEmail,
  retrieveInvite,
} from "coral-server/models/invite";
import { Tenant } from "coral-server/models/tenant";
import {
  createUser,
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

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

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
  aud: Joi.string().valid("invite"),
  email: Joi.string().email(),
});

export function validateInviteToken(token: InviteToken | object): Error | null {
  const { error } = InviteTokenSchema.validate(token, {
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
  user: Required<Pick<Invite, "id" | "email" | "expiresAt">>,
  now: Date
) {
  // Pull some stuff out of the user.
  const { id } = user;

  // Change the JS Date to a DateTime for ease of use.
  const nowDate = DateTime.fromJSDate(now);
  const nowSeconds = Math.round(nowDate.toSeconds());

  // Generate a token.
  const inviteToken: InviteToken = {
    jti: uuid(),
    iss: tenant.id,
    sub: id,
    exp: Math.round(DateTime.fromJSDate(user.expiresAt).toSeconds()),
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
    `/admin/invite#inviteToken=${token}`
  );
}

export async function verifyInviteTokenString(
  mongo: MongoContext,
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

export interface InviteUser {
  emails: string[];
  role: GQLUSER_ROLE;
}

export async function invite(
  mongo: MongoContext,
  tenant: Tenant,
  config: Config,
  mailerQueue: MailerQueue,
  signingConfig: JWTSigningConfig,
  { role, ...input }: InviteUser,
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

  // Validate all the email addresses before we start.
  const emails = input.emails.map((email, idx) => {
    // Validate the user payload.
    validateEmail(email);

    // Ensure the email address is lowercase.
    return email.toLowerCase();
  });

  if (emails.length === 0) {
    throw new InviteRequiresEmailAddresses();
  }

  // Change the JS Date to a DateTime for ease of use.
  const nowDate = DateTime.fromJSDate(now);

  // The expiry of this token is linked as 1 week after issuance.
  const expiresAt = nowDate.plus({ weeks: 1 }).toJSDate();

  const payloads: Array<{
    email: string;
    inviteURL?: string;
    invitedNow?: Invite;
  }> = [];

  // check to make sure users have not been invited previously
  for (const email of uniq(emails)) {
    const userAlready = await retrieveUserWithEmail(mongo, tenant.id, email);
    if (userAlready) {
      throw new InviteIncludesExistingUser(email);
    }
  }

  for (const email of uniq(emails)) {
    await redeemInviteFromEmail(mongo, tenant.id, email);

    // Create the User invite record.
    const invitedNow = await createInvite(
      mongo,
      tenant.id,
      {
        role,
        email,
        expiresAt,
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

    payloads.push({ email, inviteURL, invitedNow });
  }

  for (const { email, inviteURL } of payloads) {
    if (!inviteURL) {
      // There was no associated inviteURL generated for this user, do not send
      // anything.
      continue;
    }

    // Send the invited user an email with the invite token.
    await mailerQueue.add({
      template: {
        name: "account-notification/invite",
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
  }

  return emails.map((email) => {
    const result = payloads.find((payload) => payload.email === email);
    if (!result) {
      return null;
    }

    return result.invitedNow || null;
  });
}

export interface RedeemInvite {
  username: string;
  password: string;
}

export async function redeem(
  mongo: MongoContext,
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
    passwordID: uuid(),
  };

  // Create the new user based on the invite.
  const user = await createUser(
    mongo,
    tenant.id,
    {
      username,
      email,
      emailVerified: true, // Verified because the invite link was clicked.
      profile,
      role,
    },
    now
  );

  // TODO: (wyattjoh) emit that a user was created

  return user;
}
