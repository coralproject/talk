import type {
  NodeOAuthClient,
  OAuthClientMetadataInput,
  OAuthSession,
} from "@atproto/oauth-client-node";
import { Response } from "express";
import { fetch as undiciFetch } from "undici";
import { URL } from "url";

import {
  completeAuthHandoff,
  markAuthHandoffPending,
} from "coral-server/app/handlers/api/auth/handoff";
import { reconstructTenantURL } from "coral-server/app/url";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { WrappedInternalError } from "coral-server/errors";
import logger from "coral-server/logger";
import { AtprotoAuthIntegration } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import {
  AtprotoProfile,
  retrieveUserWithProfile,
  User,
} from "coral-server/models/user";
import { JWTSigningConfig, signTokenString } from "coral-server/services/jwt";
import { AugmentedRedis } from "coral-server/services/redis";
import { findOrCreate } from "coral-server/services/users";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

import { redirectWithHash } from "../oauth2";
import { StateData, storeState, verifyState } from "../oauth2/state";
import { installFetchClasses } from "./globals";
import { createSessionStore, createStateStore } from "./stores";

// "atproto" identifies the user, "transition:email" lets us read their email.
export const ATPROTO_SCOPE = "atproto transition:email";
export const ATPROTO_CALLBACK_PATH = "/api/auth/atproto/callback";
export const ATPROTO_METADATA_PATH = "/api/auth/atproto/clientmetadata.json";

// Hosts that use atproto's loopback client, which needs no metadata document.
const LOOPBACK_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

interface Options {
  config: Config;
  mongo: MongoContext;
  redis: AugmentedRedis;
  signingConfig: JWTSigningConfig;
  integration: AtprotoAuthIntegration;
  tenant: Tenant;
}

export class AtprotoAuthenticator {
  private readonly config: Config;
  private readonly mongo: MongoContext;
  private readonly redis: AugmentedRedis;
  private readonly signingConfig: JWTSigningConfig;
  private readonly tenant: Tenant;
  private readonly integration: AtprotoAuthIntegration;

  private client: Promise<NodeOAuthClient> | null = null;

  constructor({
    config,
    mongo,
    redis,
    signingConfig,
    tenant,
    integration,
  }: Options) {
    this.config = config;
    this.mongo = mongo;
    this.redis = redis;
    this.signingConfig = signingConfig;
    this.tenant = tenant;
    this.integration = integration;
  }

  /**
   * clientMetadata builds the OAuth client metadata for this Tenant. The URLs
   * come from the request so they keep the port, like the other Coral auth
   * URLs do.
   */
  private clientMetadata(req: Request): OAuthClientMetadataInput {
    const tenantURL = (path: string) =>
      reconstructTenantURL(this.config, this.tenant, req, path);

    const redirectURI = tenantURL(ATPROTO_CALLBACK_PATH);
    const loopback = LOOPBACK_HOSTS.includes(new URL(redirectURI).hostname);

    // In local development the client_id is atproto's loopback form, which
    // encodes the redirect URI and scope in the client_id itself.
    const clientID = loopback
      ? `http://localhost?${new URLSearchParams({
          redirect_uri: redirectURI,
          scope: ATPROTO_SCOPE,
        }).toString()}`
      : tenantURL(ATPROTO_METADATA_PATH);

    const { clientName, logoURI } = this.integration;

    return {
      client_id: clientID,
      client_name: clientName || this.tenant.organization.name,
      // A loopback client has no metadata document for these to appear in.
      ...(loopback ? {} : { client_uri: tenantURL("/") }),
      ...(!loopback && logoURI ? { logo_uri: logoURI } : {}),
      redirect_uris: [redirectURI],
      scope: ATPROTO_SCOPE,
      grant_types: ["authorization_code"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "none",
      dpop_bound_access_tokens: true,
    };
  }

  private async createClient(req: Request) {
    // The library needs these classes to exist before it is loaded, so it is
    // imported here, after they've been installed.
    installFetchClasses();
    const lib = await import("@atproto/oauth-client-node");

    return new lib.NodeOAuthClient({
      clientMetadata: this.clientMetadata(req),
      fetch: undiciFetch as unknown as typeof globalThis.fetch,
      stateStore: createStateStore(this.redis, this.tenant.id),
      sessionStore: createSessionStore(this.redis, this.tenant.id),
    });
  }

  private getClient(req: Request) {
    if (!this.client) {
      this.client = this.createClient(req).catch((err) => {
        // Allow the next request to try again.
        this.client = null;
        throw err;
      });
    }

    return this.client;
  }

  /**
   * metadata serves the client metadata document, whose URL is the client_id.
   */
  public metadata: RequestHandler<TenantCoralRequest, Promise<void>> = async (
    req,
    res,
    next
  ) => {
    try {
      const client = await this.getClient(req);
      res.json(client.clientMetadata);
    } catch (err) {
      return next(err);
    }
  };

  /**
   * login takes the handle from the sign in form and replies with the URL of
   * the user's authorization server for the client to navigate to.
   */
  public login: RequestHandler<TenantCoralRequest, Promise<void>> = async (
    req,
    res,
    next
  ) => {
    const handle: unknown = req.body?.handle;
    if (typeof handle !== "string" || handle.trim().length === 0) {
      res.status(400).json({ error: { message: "Invalid handle" } });
      return;
    }

    // The sign in popup's auth handoff ID, if it was opened from the stream.
    const handoff: unknown = req.body?.handoff;

    let key: string;
    try {
      // Binds the callback to this browser and stores where to send the user
      // afterwards, and the handoff ID so the callback can complete it. It
      // throws on a missing or absolute redirectTo.
      key = storeState(req, res, req.secure, {
        handoff: typeof handoff === "string" ? handoff : undefined,
      });
    } catch (err) {
      return next(err);
    }

    try {
      const client = await this.getClient(req);
      const url = await client.authorize(handle.trim(), {
        scope: ATPROTO_SCOPE,
        state: key,
      });

      // Lets the page that opened the sign in popup wait for its token.
      await markAuthHandoffPending(this.redis, this.tenant.id, handoff);

      res.json({ url: url.href });
    } catch (err) {
      logger.warn(
        { err, tenantID: this.tenant.id },
        "could not start atproto authorization"
      );
      res.status(400).json({
        error: { message: "Unable to sign in with that handle." },
      });
    }
  };

  /**
   * callback completes the authorization, then signs the user in the same way
   * Coral's other OAuth integrations do: it redirects back to where the user
   * started with a Coral access token, or an error, in the URL hash.
   */
  public callback: RequestHandler<TenantCoralRequest, Promise<void>> = async (
    req,
    res,
    next
  ) => {
    const { now } = req.coral;

    // The authorization server sends its response as query parameters.
    const params = new URL(req.originalUrl, "http://callback").searchParams;

    let did: string;
    let email: string | undefined;
    let state: StateData;
    try {
      const client = await this.getClient(req);
      const result = await client.callback(params);

      did = result.session.did;
      email = await this.getEmail(result.session);
      // The state key we passed to authorize() comes back here. Checking it
      // against the cookie ties this callback to the browser that started it.
      state = verifyState(req, res, req.secure, result.state ?? undefined);
    } catch (err) {
      // Without a verified state we don't know where to send the user back to,
      // unless the error carries our state key (for example when the user
      // denied access), so try that before giving up.
      const key = (err as { state?: unknown }).state;
      if (typeof key === "string") {
        try {
          return this.fail(
            res,
            verifyState(req, res, req.secure, key),
            err as Error
          );
        } catch {
          // Fall through to the generic error.
        }
      }

      return next(err);
    }

    try {
      const profile: AtprotoProfile = { type: "atproto", id: did };

      let user = await retrieveUserWithProfile(
        this.mongo,
        this.tenant.id,
        profile
      );
      if (!user) {
        if (!this.integration.allowRegistration) {
          throw new Error("registration is disabled");
        }

        // Like Coral's other integrations, the user is asked to complete their
        // account after signing in: a username, and an email address if their
        // PDS didn't share one.
        user = await findOrCreate(
          this.config,
          this.mongo,
          this.redis,
          this.tenant,
          {
            role: GQLUSER_ROLE.COMMENTER,
            email,
            // Like Coral's other integrations, an email from the provider is
            // not treated as verified by Coral.
            emailVerified: false,
            profile,
          },
          {},
          now
        );
      }

      const accessToken = await signTokenString(
        this.signingConfig,
        user,
        this.tenant,
        {},
        now
      );

      // When the account doesn't need completing, hand the token to the page
      // that opened the sign in popup now. Otherwise the popup hands it off
      // once the user completes their account.
      if (state.handoff && this.isAccountComplete(user)) {
        try {
          await completeAuthHandoff(
            this.redis,
            this.tenant.id,
            state.handoff,
            accessToken
          );
        } catch (err) {
          logger.error(
            { err, tenantID: this.tenant.id },
            "could not complete atproto auth handoff"
          );
        }
      }

      return redirectWithHash(res, state, { accessToken });
    } catch (err) {
      return this.fail(res, state, err as Error);
    }
  };

  /**
   * isAccountComplete mirrors the sign in popup's account completion: a user
   * needs an email address, a username, and a password when local sign in is
   * enabled for the stream.
   */
  private isAccountComplete(user: User) {
    if (!user.email || !user.username) {
      return false;
    }

    const { local } = this.tenant.auth.integrations;
    if (local.enabled && local.targetFilter.stream) {
      return !!user.profiles?.some((p) => p.type === "local");
    }

    return true;
  }

  /**
   * getEmail reads the user's email from their PDS, which the
   * "transition:email" scope allows. It's undefined when the user's PDS
   * doesn't share it, and the user will be asked for one instead.
   */
  private async getEmail(session: OAuthSession): Promise<string | undefined> {
    try {
      const resp = await session.fetchHandler(
        "/xrpc/com.atproto.server.getSession"
      );
      if (!resp.ok) {
        return undefined;
      }

      const body: { email?: unknown } = await resp.json();
      if (typeof body.email === "string" && body.email.length > 0) {
        return body.email.toLowerCase();
      }
    } catch (err) {
      logger.warn(
        { err, tenantID: this.tenant.id },
        "could not look up atproto email"
      );
    }

    return undefined;
  }

  private fail(res: Response, state: StateData, err: Error) {
    const error = new WrappedInternalError(
      err,
      "an authentication error occurred"
    );

    logger.error(
      { err, tenantID: this.tenant.id },
      "an atproto authentication error occurred for a user"
    );

    return redirectWithHash(res, state, { error: error.message });
  }
}
