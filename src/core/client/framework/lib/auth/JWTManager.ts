import { EventEmitter } from "events";
import { clearLongTimeout, LongTimeout, setLongTimeout } from "long-settimeout";

import { Claims, computeExpiresIn, parseAccessTokenClaims } from "./helpers";

const ACCESS_TOKEN_KEY = "coral:v1:accessToken";

class JWTManager extends EventEmitter {
  private readonly storage: Storage;

  private timeout: LongTimeout | null = null;
  private accessToken: string | null = null;
  private accessTokenClaims: Claims | null = null;

  constructor(storage: Storage) {
    // Setup the underlying event emitter.
    super();

    // Store the storage reference.
    this.storage = storage;

    // Try to get the accessToken from storage now.
    const accessToken = this.storage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) {
      // There is no token in persisted storage! Nothing to do.
      return;
    }

    // Now that we got a token, let's set it up. If `set` returns false, it
    // implies that the token was invalid or expired.
    const set = this.set(accessToken);
    if (!set) {
      this.remove();
    }

    // TODO: subscribe to storage change notifications
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getClaims(): Claims | null {
    return this.accessTokenClaims;
  }

  /**
   * set will update the access token in memory and persist it to storage. If
   * there is an expiry on the token, a callback will be registered to
   * automatically clear it when the timer expires.
   *
   * @param accessToken the new access token to use
   */
  public set(accessToken: string) {
    // Try to parse the token claims.
    const accessTokenClaims = parseAccessTokenClaims(accessToken);
    if (!accessTokenClaims) {
      return false;
    }

    // If the token has an expiry, then register a callback to remove it.
    if (accessTokenClaims.exp) {
      const expiresIn = computeExpiresIn(accessTokenClaims.exp);
      if (!expiresIn) {
        // The token has expired, don't set anything!
        return false;
      }

      // If there was an existing timeout, clear it.
      if (this.timeout) {
        clearLongTimeout(this.timeout);
      }

      // Create the new timeout to clear out the token.
      this.timeout = setLongTimeout(() => {
        // Remove the access token when it expires.
        this.remove();

        // Emit that the stored access token has been updated.
        this.emit("expired");
      }, expiresIn);
    }

    // Now that we've verified that the token is valid (is a JWT), and have
    // handled if the token is expired or not, we should store it in memory and
    // persist it to storage.
    this.accessToken = accessToken;
    this.accessTokenClaims = accessTokenClaims;
    this.storage.setItem(ACCESS_TOKEN_KEY, accessToken);

    // Emit that the stored access token has been updated.
    this.emit("updated");
    this.emit("changed");

    return true;
  }

  /**
   * remove will remove the access token from memory and remove the expiry
   * callback.
   */
  public remove() {
    // Remove the access token from memory.
    this.accessToken = null;
    this.accessTokenClaims = null;

    // If there is an active timeout, remove it.
    if (this.timeout) {
      clearLongTimeout(this.timeout);
      this.timeout = null;
    }

    // Remove the token from storage.
    this.storage.removeItem(ACCESS_TOKEN_KEY);

    // Emit that the stored access token has been removed.
    this.emit("removed");
    this.emit("changed");
  }
}

export default JWTManager;
