import type {
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node";
import { CookieStore } from "./cookie";

export class StateStore implements NodeSavedStateStore {
  // async get, set and del - called by client.authorize()
  constructor(private store: CookieStore) {}
  public async get(key: string): Promise<NodeSavedState | undefined> {
    const state = await this.store.getStateFromCookie(key);
    return state;
  }
  public async set(key: string, state: NodeSavedState) {
    await this.store.setStateCookie(key, state);
  }
  public async del(key: string) {
    await this.store.deleteCookie(key);
  }
}
