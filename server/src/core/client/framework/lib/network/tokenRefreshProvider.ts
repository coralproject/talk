import { TokenRefresh } from "./createNetwork";

export type UnregisterCallback = () => void;
export interface TokenRefreshProvider {
  register(cb: TokenRefresh): UnregisterCallback;
  refreshToken: TokenRefresh;
}

export function createTokenRefreshProvider(): TokenRefreshProvider {
  const callbacks: TokenRefresh[] = [];
  return {
    register: (cb) => {
      callbacks.push(cb);
      return () => {
        const index = callbacks.indexOf(cb);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      };
    },
    refreshToken: async (req, res) => {
      for (const cb of callbacks) {
        const result = await cb(req, res);
        if (result) {
          return result;
        }
      }
      return "";
    },
  };
}
