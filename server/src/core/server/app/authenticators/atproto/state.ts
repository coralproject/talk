import type {
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node";
import { CookieStore } from "./cookie";

export class StateStore implements NodeSavedStateStore {
  // async get, set and del - called by client.authorize()
  constructor(private store: CookieStore) {}
  public async get(key: string): Promise<NodeSavedState | undefined> {
    console.log("get state called");
    const state = await this.store.getStateFromCookie(key);
    return state as NodeSavedState;
  }
  public async set(key: string, state: NodeSavedState) {
    console.log("set state called");
    await this.store.setStateCookie(key, state);
  }
  public async del(key: string) {
    console.log("delete state called");
    await this.store.deleteCookie(key);
  }
}
