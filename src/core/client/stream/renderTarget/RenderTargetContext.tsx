import React, { FunctionComponent, useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

import RenderTargetManager from "./RenderTargetManager";

export interface RenderTargetContext {
  modal: RenderTargetManager;
  footer: RenderTargetManager;
}

export const RenderTargetContext = React.createContext<RenderTargetContext>(
  null as any
);

/**
 * RenderTargetContextProvider will set the context for the render target feature.
 * render targets lets you render to other render target which is usually a different
 * iframe that we control.
 */
export const RenderTargetContextProvider: FunctionComponent = (props) => {
  const { pym, window } = useCoralContext();
  const value = useMemo(
    () => ({
      modal: new RenderTargetManager("modal", window, pym),
      footer: new RenderTargetManager("footer", window, pym),
    }),
    [pym, window]
  );
  return <RenderTargetContext.Provider value={value} {...props} />;
};
