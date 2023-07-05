import crypto from "crypto";
import Joi from "joi";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { validateSchema } from "coral-server/helpers";
import { FacebookAuthIntegration } from "coral-server/models/settings";
import {
  FacebookProfile,
  retrieveUserWithProfile,
} from "coral-server/models/user";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { findOrCreate } from "coral-server/services/users";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

import { ExchangeResponse, OAuth2Authenticator } from "../oauth2";

interface Options {
  config: Config;
  mongo: MongoContext;
  signingConfig: JWTSigningConfig;
  integration: Required<FacebookAuthIntegration>;
  callbackPath: string;
}

const FacebookUserProfileSchema = Joi.object().keys({
  id: Joi.string().required(),
  picture: Joi.object()
    .keys({
      data: Joi.object().keys({
        url: Joi.string(),
      }),
    })
    .optional(),
  email: Joi.string().email().lowercase().optional(),
});

interface FacebookUserProfile {
  id: string;
  picture?: {
    data: {
      url: string;
    };
  };
  email?: string;
}

const VERSION = "v3.2";

export class FacebookAuthenticator extends OAuth2Authenticator {
  private readonly mongo: MongoContext;
  private readonly config: Config;
  private readonly profileURL = `https://graph.facebook.com/${VERSION}/me`;
  private readonly integration: Readonly<Required<FacebookAuthIntegration>>;

  constructor({ integration, mongo, config, ...options }: Options) {
    super({
      ...options,
      ...integration,
      config,
      authorizationURL: `https://www.facebook.com/${VERSION}/dialog/oauth`,
      tokenURL: `https://graph.facebook.com/${VERSION}/oauth/access_token`,
      scope: "email",
      authorizationParams: {
        display: "popup",
      },
    });

    this.integration = integration;
    this.mongo = mongo;
    this.config = config;
  }

  /**
   * getProof will generate a proof that we have the client secret. For more
   * information, see:
   * https://developers.facebook.com/docs/reference/api/securing-graph-api/
   *
   * @param accessToken the access token aquired during the auth flow
   */
  private getProof(accessToken: string) {
    return crypto
      .createHmac("sha256", this.integration.clientSecret)
      .update(accessToken)
      .digest("hex");
  }

  private async getProfile(accessToken: string): Promise<FacebookUserProfile> {
    const profileURL = new URL(this.profileURL);

    // Specify the fields we want.
    profileURL.searchParams.set("fields", "id,picture,email");
    profileURL.searchParams.set("appsecret_proof", this.getProof(accessToken));

    // Get the profile from the provider.
    const data = await this.get(profileURL.href, accessToken);

    // Try to parse the profile.
    let profile: any;
    try {
      profile = JSON.parse(data);
    } catch (err) {
      throw new Error("failed to parse the facebook profile");
    }

    return validateSchema(FacebookUserProfileSchema, profile);
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
        const { id, picture, email } = await this.getProfile(accessToken);

        // Create the user profile that will be used to lookup the User.
        const profile: FacebookProfile = {
          type: "facebook",
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
            avatar: picture?.data.url,
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
