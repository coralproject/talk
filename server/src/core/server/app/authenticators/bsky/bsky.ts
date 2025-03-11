// import crypto from "crypto";
import { isValidHandle } from '@atproto/syntax';
import Joi from "joi";
import { Agent } from '@atproto/api';
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { validateSchema } from "coral-server/helpers";
import { AtprotoOauthAuthenticator } from "../atproto/oauth";
import { BskyAuthIntegration } from "coral-server/models/settings";
import { BskyProfile, retrieveUserWithProfile } from "coral-server/models/user";
// import { JWTSigningConfig } from "coral-server/services/jwt";
import { findOrCreate } from "coral-server/services/users";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";


interface Options {
  config: Config;
  mongo: MongoContext;
  // signingConfig: JWTSigningConfig;
  integration: Required<BskyAuthIntegration>;
  // callbackPath: string;
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

interface BskyUserProfile {
  did: string;
  handle: string;
  avatar?: string;
  displayName?: string;
}



export class BskyAuthenticator extends AtprotoOauthAuthenticator {
  private readonly mongo: MongoContext;
  private readonly config: Config;
  private readonly integration: Readonly<Required<BskyAuthIntegration>>;

  constructor({ integration, mongo, config, ...options }: Options) {
    super({
      ...options,
      ...integration,
      config,
      clientID: '',
      clientName: '',
      clientURI: '',
    });

    this.integration = integration;
    this.mongo = mongo;
    this.config = config;

  }

  //authenticate is the login function that calls authorize
  public authenticate: RequestHandler<TenantCoralRequest, Promise<void>> =
    async (req, res, next) => {
      // const { tenant, now } = req.coral; // you need these later to handle clientID == tenant settings

      //add handle validation here
      //also pull from req.body after its added to that
      const handle = 'immber.bsky.social';
      if (typeof handle !== 'string' || !isValidHandle(handle)) {
        console.log(`${handle} is not a valid handle`)
        return next(`${handle} is not a valid handle`)
      }
      try {
        //redirect user to login
        const loginUrl:string = await this.callAuthorize(handle, req, res)
        if (loginUrl) {
          return res.redirect(loginUrl);
        }
      } catch (err) {
        return next(err);
      }
    };

  public callback: RequestHandler<TenantCoralRequest, Promise<void>> =
    async (req , res, next) => {
    try {
      const { tenant, now } = req.coral;
      //complete the oauth session callback and use the Atproto API to get user's profile
      const params = new URLSearchParams(req.originalUrl.split('?')[1]);
      const agent:Agent = await this.getSessionAgent(params);
      const profile = await agent.getProfile({ actor: agent.did})

      // Validate the profile.
      try {
        validateSchema(BskyUserProfileSchema, profile.data)
      } catch {
        throw new Error("failed to parse the Bluesky profile");
      }
      // Lookup or create the User
      try {
        const bskyProfile: BskyProfile = {
          type: "bsky",
          id: profile.data.did
        };
        //Locate an existing coral user
        let user = await retrieveUserWithProfile(
          this.mongo,
          tenant.id,
          bskyProfile
        );
        if (user) {
          return this.success(agent, user, req, res);
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

        return this.success(agent, user, req, res);
      } catch (err) {
        return this.fail(err, req, res);
      }
    } catch (err) {
        return this.fail(err as Error, req, res)
    }
  }
}
