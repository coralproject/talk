// import crypto from "crypto";
import { Agent } from "@atproto/api";
import { isValidHandle } from "@atproto/syntax";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { validateSchema } from "coral-server/helpers";
import { BskyAuthIntegration } from "coral-server/models/settings";
import { BskyProfile, retrieveUserWithProfile } from "coral-server/models/user";
// import { JWTSigningConfig } from "coral-server/services/jwt";
import { findOrCreate } from "coral-server/services/users";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";
import Joi from "joi";
import { AtprotoOauthAuthenticator } from "../atproto/oauth";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

interface Options {
  config: Config;
  mongo: MongoContext;
  // signingConfig: JWTSigningConfig;
  integration: Required<BskyAuthIntegration>;
  callbackPath: string;
  // clientID: string;
  // clientName: string;
  // clientURI: string;
  // redirectURIs: Array<string>;
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

  constructor({ integration, mongo, config, ...options }: Options) {
    super({
      ...options,
      ...integration,
      callbackPath: "/api/auth/bsky/callback",
      clientID: "",
      clientName: integration.clientID,
      clientURI: "",
    });

    this.integration = integration;
    this.mongo = mongo;
    this.config = config;
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
      // const { tenant, now } = req.coral; // you need these later to handle clientID == tenant settings
      console.log('trying to authenticate handle')
      console.log(req.body);
      // add handle validation here
      // also pull from req.body after its added to that
      const handle = "immber.bsky.social";
      if (typeof handle !== "string" || !isValidHandle(handle)) {
        return next(`${handle} is not a valid handle`);
      }
      try {
        // redirect user to login
        const loginUrl: string = await this.callAuthorize(
          handle,
          req,
          res as any
        );
        if (loginUrl) {
          return res.redirect(loginUrl);
        }
      } catch (err) {
        return next(err);
      }
    };

  public callback: RequestHandler<TenantCoralRequest, Promise<void>> = async (
    req,
    res,
    next
  ) => {
    // grab where the user started so we can send them back after
    const redirectTo: string = req.originalUrl;
    try {
      const { tenant, now } = req.coral;
      // complete the oauth session callback and use the Atproto API to get user's profile
      const params = new URLSearchParams(req.originalUrl.split("?")[1]);
      const agent: Agent = await this.getSessionAgent(params);
      const profile = await agent.getProfile({ actor: agent.assertDid });

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
          return this.success(redirectTo, user, req, res as any);
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
            emailVerified: false,
            avatar: profile.data.avatar,
            profile: bskyProfile,
          },
          {},
          now
        );

        return this.success(redirectTo, user, req, res as any);
      } catch (err) {
        return this.fail(redirectTo, err as Error, req, res as any);
      }
    } catch (err) {
      return this.fail(redirectTo, err as Error, req, res as any);
    }
  };
}
