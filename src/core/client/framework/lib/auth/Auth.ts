import { createInMemoryStorage } from "../storage";
import JWTManager from "./JWTManager";

class Auth {
  private manager: JWTManager;

  constructor(storage: Storage = createInMemoryStorage()) {
    // Create the new LockBox instance based on the provided storage.
    this.manager = new JWTManager(storage);
  }

  /**
   * getAccessToken will return the current access token or an empty string.
   */
  public readonly getAccessToken = () => {
    const accessToken = this.manager.getAccessToken();
    if (!accessToken) {
      return "";
    }

    return accessToken;
  };

  public readonly getClaims = () => {
    const claims = this.manager.getClaims();
    if (!claims) {
      return {};
    }

    return claims;
  };

  /**
   * set will either clear the existing token if non is provided or update it to
   * the passed token.
   *
   * @param accessToken possibly the new token to use
   */
  public readonly set = (accessToken?: string | null) => {
    if (!accessToken) {
      this.manager.remove();

      return false;
    }

    return this.manager.set(accessToken);
  };

  /**
   * remove will remove the access token from storage and memory.
   */
  public readonly remove = () => {
    return this.manager.remove();
  };

  /**
   * onChange will register a function to be called when the access token is
   * changed. It returns a function that will unsubscribe from the changes.
   *
   * @param fn the function to call when access token changes
   */
  public readonly onChange = (fn: () => void) => {
    // Every time that the token is "changed", fire this function.
    this.manager.addListener("changed", fn);

    return () => {
      this.manager.removeListener("changed", fn);
    };
  };
}

export default Auth;
