import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/core";
import React from "react";
import * as ReactShadow from "react-shadow";

const cache = new WeakMap();
const createProxy = (ReactShadow as any).createProxy;

/**
 * Creates a ReactShadow proxy with telling emotions to insert its styles into the shadow root
 * This is only needed because of @giphy/react-components
 *
 * TODO: (cvle) Currently some styles still slip into light dom.
 * TODO: (cvle) Replace giphy components?
 */
export default createProxy({}, "emotion", ({ root, children }: any) => {
  const options =
    cache.get(root) ||
    (() => {
      const opts = createCache({
        container: root,
        key: "react-shadow",
      });
      cache.set(root, opts);
      return opts;
    })();

  return (
    <CacheProvider value={options}>
      <>{children}</>
    </CacheProvider>
  );
});
