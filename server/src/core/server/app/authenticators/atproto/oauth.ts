import cookie from "cookie";
import type {
  NodeOAuthClient,
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from '@atproto/oauth-client-node';
import {
  Request,
  TenantCoralRequest,
} from "coral-server/types/express";


const enc = encodeURIComponent;

interface Options {
  clientID: string;
  clientName: string;
  clientURI: string;
 }

 interface atprotoCallbackResponse {
  params: any;
}

class CookieStore {
  public req: Request<TenantCoralRequest>;
  public resp: Response;

  constructor() {};

  async function setStateCookie(key: string, state: NodeSavedState) {
    const data = JSON.stringify(state)
    this.resp.cookie(key, data); //add back cookie secure options if this works
  }

  async function setSessionCookie(key: string, session: NodeSavedSession) {
    const data = JSON.stringify(session)
    this.resp.cookie(key, data);
  }

  async function retrieveCookie(key: string){
    const header = this.req.headers.cookie;
    const cookies = cookie.parse(header);
    if (cookies.keys.includes(key)) {
      return JSON.parse(cookies[key])
    } else {
      throw new Error("missing atproto cookie")
    }
  }

  async function getStateFromCookie(key: string){
    const state = await retrieveCookie(key)
      return state as NodeSavedState
  }

  async function  getSessionFromCookie(key:string) {
    const session = await retrieveCookie(key)
    return session as NodeSavedSession
  }

  async function deleteCookie(key: string) {
    this.resp.clearCookie(key);
  }
}


class StateStore implements NodeSavedStateStore {
  // async get, set and del - called by client.authorize()
  async get(key: string): Promise<NodeSavedState | undefined>{
    const state = await getStateFromCookie(key);
    return state as NodeSavedState
  }
  async set(key: string, state: NodeSavedState){
    await setStateCookie(key, state);
  }
  async del(key: string){
    await deleteCookie(key);
  }
}

class SessionStore implements NodeSavedSessionStore {
  async get(key: string): Promise<NodeSavedSession | undefined>{
    const session = await getSessionFromCookie(key);
    return session as NodeSavedSession
  }
  async set(key: string, session: NodeSavedSession){
    await setSessionCookie(key, session);
  }
  async del(key: string){
    await deleteCookie(key);
  }
}


export abstract class AtprotoOauthAuthenticator {

  private readonly clientID: string;
  private readonly clientName: string;
  private readonly clientURI: string;

  private readonly cookieStore: CookieStore;
  private readonly stateStore: NodeSavedStateStore;
  private readonly sessionStore: NodeSavedSessionStore;
  private readonly client: NodeOAuthClient;

  constructor({
    clientID,
    clientName,
    clientURI,
  }: Options) {
    this.clientID = clientID;
    this.clientName = clientName;
    this.clientURI = clientURI;

    this.cookieStore = new CookieStore()
    this.stateStore = new StateStore();
    this.sessionStore = new SessionStore();

    this.client = new NodeOAuthClient({
      clientMetadata: {
        client_name: clientName,
        // client_id: clientID, //fix after working locally
        client_id: `http://localhost?redirect_uri=${enc(`http://127.0.0.1:3000/oauth/callback`)}&scope=${enc('atproto transition:generic')}`,
        client_uri: 'http://127.0.0.1:3000',
        redirect_uris: [`http://127.0.0.1:3000/oauth/callback`],
        scope: 'atproto transition:generic',
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        application_type: 'web',
        token_endpoint_auth_method: 'none',
        dpop_bound_access_tokens: true,
      },
      sessionStore: this.sessionStore,
      stateStore: this.stateStore
    });
  };

  protected async callAuthorize(
    handle: string,
    req: Request<TenantCoralRequest>,
    res: Response,
  ){
    //attch this req/resp to the cookiestore
    this.cookieStore.req = req;
    this.cookieStore.resp = res;

    //redirect user to login
    const loginUrl:URL = await this.client.authorize(handle, {
      scope: 'atproto transition:generic',
    })
    if (loginUrl) {
      return loginUrl.href;
    } else {
      throw new Error("authorize request failed")
    }
  }
// you need a Helper function to get the Atproto Agent for the active session before you can hook up a callback
}
