import { Agent } from "@atproto/api";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { validateSchema } from "coral-server/helpers";
import { BskyAuthIntegration } from "coral-server/models/settings";
import { BskyProfile, retrieveUserWithProfile } from "coral-server/models/user";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { findOrCreate } from "coral-server/services/users";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";
import Joi from "joi";
import { AtprotoOauthAuthenticator } from "../atproto/oauth";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";
import { Redis } from "ioredis";

interface Options {
  config: Config;
  mongo: MongoContext;
  redis: Redis;
  signingConfig: JWTSigningConfig;
  integration: Required<BskyAuthIntegration>;
  callbackPath: string;
}

const BskyUserProfileSchema = Joi.object().keys({
  did: Joi.string().required(),
  handle: Joi.string().required(),
  avatar: Joi.string().optional(),
  displayName: Joi.string().optional(),
});

export class BskyAuthenticator extends AtprotoOauthAuthenticator {
  private readonly mongo: MongoContext;
  private readonly config: Config;
  private readonly integration: Readonly<Required<BskyAuthIntegration>>;
  private readonly redis: Redis;
  // private readonly secure: Boolean; //TODO: pass to cookiestore

  constructor({ integration, mongo, redis, config, ...options }: Options) {
    super({
      ...options,
      ...integration,
      callbackPath: "/api/auth/bsky/callback",
      clientName: integration.clientID,
      clientSecret: integration.clientSecret,
    });

    this.integration = integration;
    this.mongo = mongo;
    this.redis = redis;
    this.config = config;
    // this.secure = config.get("force_ssl");
  }

  public metadata: RequestHandler<TenantCoralRequest, Promise<any>> = async (
    req,
    res,
    next
  ) => {
    const jsonClientMetadata = this.getClientMetadata();
    return res.json(jsonClientMetadata);
  };

  // authenticate is the login function that calls authorize
  public authenticate: RequestHandler<TenantCoralRequest, Promise<void>> =
    async (req, res, next) => {
      let loginUrl: string | Error;
      try {
        // get authorization redirect url
        loginUrl = (await this.callAuthorize(req, res)) as unknown as string;
      } catch (err) {
        return next(err);
      }
      if (loginUrl && typeof loginUrl === "string") {
        res.redirect(loginUrl);
      } else {
        return next(loginUrl);
      }
    };

  public callback: RequestHandler<TenantCoralRequest, Promise<void>> = async (
    req,
    res,
    next
  ) => {
    // grab where the user started so we can send them back after
    const redirectTo = this.cookieStore.req.headers.referer as string;

    try {
      const { tenant, now } = req.coral;
      // attach this req/resp to the cookiestore
      this.cookieStore.attach(req, res);
      // complete the oauth session callback and use the Atproto API to get user's profile
      const params = new URLSearchParams(req.originalUrl.split("?")[1]);
      const agent: Agent = await this.getSessionAgent(params);
      const profile = await agent.getProfile({ actor: agent.did as string });

      // Validate the profile.
      try {
        validateSchema(BskyUserProfileSchema, profile.data);
      } catch {
        throw new Error("failed to parse the Bluesky profile");
      }
      // Lookup or create the User
      try {
        const bskyProfile: BskyProfile = {
          type: "bsky",
          id: profile.data.did,
        };
        // Locate an existing coral user
        let user = await retrieveUserWithProfile(
          this.mongo,
          tenant.id,
          bskyProfile
        );
        if (user) {
          return this.success(redirectTo, user, req, res);
        }

        if (!this.integration.allowRegistration) {
          throw new Error("registration is disabled");
        }
        // Create the user this time.
        user = await findOrCreate(
          this.config,
          this.mongo,
          this.redis,
          tenant,
          {
            role: GQLUSER_ROLE.COMMENTER,
            emailVerified: false,
            avatar: profile.data.avatar,
            profile: bskyProfile,
          },
          {},
          now
        );

        return this.success(redirectTo, user, req, res);
      } catch (err) {
        return this.fail(redirectTo, err as Error, req, res);
      }
    } catch (err) {
      return this.fail(redirectTo, err as Error, req, res);
    }
  };
}
