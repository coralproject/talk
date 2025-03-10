import { Agent } from '@atproto/api';
import crypto from "crypto";
import Joi from "joi";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { validateSchema } from "coral-server/helpers";
import { AtprotoOauthAuthenticator } from "../atproto/oauth";
import { BskyAuthIntegration } from "coral-server/models/settings";
import { BskyProfile, retrieveUserWithProfile } from "coral-server/models/user";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { findOrCreate } from "coral-server/services/users";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";
import { isValidHandle } from '@atproto/syntax';

import {
  NodeOAuthClient,
  type NodeSavedSession,
  type NodeSavedSessionStore,
  type NodeSavedState,
  type NodeSavedStateStore,
} from '@atproto/oauth-client-node';

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";


interface Options {
  config: Config;
  mongo: MongoContext;
  signingConfig: JWTSigningConfig;
  integration: Required<BskyAuthIntegration>;
  callbackPath: string;
  clientID: string;
  clientName: string;
  clientURI: string;
  redirectURIs: Array<string>;
  stateStore: NodeSavedStateStore;
  sessionStore: NodeSavedSessionStore;
}

const BskyUserProfileSchema = Joi.object().keys({
  did: Joi.string().required(),
  handle: Joi.string().required(),
  picture: Joi.object()
    .keys({
      data: Joi.object().keys({
        url: Joi.string(),
      }),
    })
    .optional(),
  displayName: Joi.string().optional(),
});

interface BskyUserProfile {
  did: string;
  handle: string;
  picture?: {
    data: {
      url: string;
    };
  };
  displayName?: string;
}



export class BskyAuthenticator extends AtprotoOauthAuthenticator {
  private readonly mongo: MongoContext;
  private readonly config: Config;
  private readonly handle: string;
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
    this.handle = 'immber.bsky.social';

  }

///get profile will become the "/callback function"
  private async getProfile(agent: Agent ): Promise<BskyUserProfile> {
    const profile = await agent.getProfile({ actor: agent.did });
    return profile.data;
  }


  private async getProfile(accessToken: string): Promise<BskyUserProfile> {
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
      throw new Error("failed to parse the Bluesky profile");
    }

    return validateSchema(BskyUserProfileSchema, profile);
  }

  //authenticate will become the /post login function that calls authorize
  public authenticate: RequestHandler<TenantCoralRequest, Promise<void>> =
    async (req, res, next) => {
      const { tenant, now } = req.coral;

      //add handle validation here
      //also pull from req.body after its added to that
      if (typeof this.handle !== 'string' || !isValidHandle(this.handle)) {
        console.log(`${this.handle} is not a valid handle`)
        return next(`${this.handle} is not a valid handle`)
      }


      try {
        //redirect user to login
        const loginUrl:string = await this.authorize(this.handle)
        if (loginUrl) {
          return res.redirect(loginUrl);
        }
      } catch (err) {
        return next(err);
      }
    };

    //   const {
    //     state,
    //     tokens: { accessToken },
    //   } = response;

    //   try {
    //     // Get the profile of the user.
    //     const { id, picture, email } = await this.getProfile(accessToken);

    //     // Create the user profile that will be used to lookup the User.
    //     const profile: BskyProfile = {
    //       type: "bsky",
    //       id,
    //     };

    //     let user = await retrieveUserWithProfile(
    //       this.mongo,
    //       tenant.id,
    //       profile
    //     );
    //     if (user) {
    //       return this.success(state, user, req, res);
    //     }

    //     if (!this.integration.allowRegistration) {
    //       throw new Error("registration is disabled");
    //     }

    //     // Create the user this time.
    //     user = await findOrCreate(
    //       this.config,
    //       this.mongo,
    //       tenant,
    //       {
    //         role: GQLUSER_ROLE.COMMENTER,
    //         email,
    //         emailVerified: false,
    //         avatar: picture?.data.url,
    //         profile,
    //       },
    //       {},
    //       now
    //     );

    //     return this.success(state, user, req, res);
    //   } catch (err) {
    //     return this.fail(state, err as Error, req, res);
    //   }
    // };
}

//do you need to recreate success and fail then hook them up ^
