import type {
  NodeSavedSession,
  NodeSavedSessionStore,
} from "@atproto/oauth-client-node";
import { CookieStore } from "./cookie";

export class SessionStore implements NodeSavedSessionStore {
  constructor(private store: CookieStore) {}
  public async get(key: string): Promise<NodeSavedSession | undefined> {
    const session = await this.store.getSessionFromCookie(key);
    return session;
  }
  public async set(key: string, session: NodeSavedSession) {
    await this.store.setSessionCookie(key, session);
  }
  public async del(key: string) {
    await this.store.deleteCookie(key);
  }
}
