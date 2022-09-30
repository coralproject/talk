import Joi from "joi";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { validateSchema } from "coral-server/helpers";
import { GoogleAuthIntegration } from "coral-server/models/settings";
import {
  GoogleProfile,
  retrieveUserWithProfile,
} from "coral-server/models/user";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { findOrCreate } from "coral-server/services/users";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

import { ExchangeResponse, OAuth2Authenticator } from "../oauth2";

interface Options {
  mongo: MongoContext;
  signingConfig: JWTSigningConfig;
  config: Config;
  integration: Required<GoogleAuthIntegration>;
  callbackPath: string;
}

const GoogleUserProfileSchema = Joi.object().keys({
  sub: Joi.string().required(),
  picture: Joi.string().required(),
  email: Joi.string().lowercase().email(),
});

interface GoogleUserProfile {
  sub: string;
  picture: string;
  email: string;
}

export class GoogleAuthenticator extends OAuth2Authenticator {
  private readonly mongo: MongoContext;
  private readonly config: Config;
  private readonly profileURL = "https://www.googleapis.com/oauth2/v3/userinfo";
  private readonly integration: Readonly<Required<GoogleAuthIntegration>>;

  constructor({ integration, mongo, config, ...options }: Options) {
    super({
      ...options,
      ...integration,
      config,
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenURL: "https://www.googleapis.com/oauth2/v4/token",
      scope: "profile email",
    });

    this.integration = integration;
    this.mongo = mongo;
    this.config = config;
  }

  private async getProfile(accessToken: string): Promise<GoogleUserProfile> {
    // Get the profile from the provider.
    const data = await this.get(this.profileURL, accessToken);

    // Try to parse the profile.
    let profile: any;
    try {
      profile = JSON.parse(data);
    } catch (err) {
      throw new Error("failed to parse the google profile");
    }

    return validateSchema(GoogleUserProfileSchema, profile);
  }

  public authenticate: RequestHandler<TenantCoralRequest, Promise<void>> =
    async (req, res, next) => {
      const { tenant, now } = req.coral;

      let response: ExchangeResponse;

      try {
        // If we don't have a code on the request, then we should redirect the user.
        if (!req.query.code) {
          return this.redirect(req, res);
        }

        // Exchange the code for a token.
        response = await this.exchange(req, res);
      } catch (err) {
        return next(err);
      }

      const {
        state,
        tokens: { accessToken },
      } = response;

      try {
        // Get the profile of the user.
        const { sub: id, picture, email } = await this.getProfile(accessToken);

        // Create the user profile that will be used to lookup the User.
        const profile: GoogleProfile = {
          type: "google",
          id,
        };

        let user = await retrieveUserWithProfile(
          this.mongo,
          tenant.id,
          profile
        );
        if (user) {
          return this.success(state, user, req, res);
        }

        if (!this.integration.allowRegistration) {
          throw new Error("registration is disabled");
        }

        // Create the user this time.
        user = await findOrCreate(
          this.config,
          this.mongo,
          tenant,
          {
            role: GQLUSER_ROLE.COMMENTER,
            email,
            emailVerified: false,
            avatar: picture,
            profile,
          },
          {},
          now
        );

        return this.success(state, user, req, res);
      } catch (err) {
        return this.fail(state, err, req, res);
      }
    };
}
