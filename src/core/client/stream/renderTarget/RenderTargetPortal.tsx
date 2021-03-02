import React, { FunctionComponent, useContext, useMemo } from "react";
import ReactDOM from "react-dom";

import { useEffectAtUnmount } from "coral-framework/hooks";
import {
  CoralReactContext,
  getUIContextPropsFromCoralContext,
  useCoralContext,
} from "coral-framework/lib/bootstrap/CoralContext";
import { RenderTargetContext } from "coral-stream/renderTarget";
import { UIContext } from "coral-ui/components/v2";

interface Props {
  target: keyof RenderTargetContext;
}

/**
 * A React Portal that allows you to render to another render target.
 */
const RenderTargetPortal: FunctionComponent<Props> = ({ target, children }) => {
  const coralContext = useCoralContext();
  const targets = useContext(RenderTargetContext);
  const renderTarget = targets[target];
  const [targetNode, releaseTargetNode] = useMemo(
    () => renderTarget.acquireRenderTarget(),
    [renderTarget]
  );
  const window = renderTarget.getWindow();
  const newCoralContext = useMemo(
    () => ({
      ...coralContext,
      renderWindow: window,
    }),
    [coralContext, window]
  );
  const newUIContext = useMemo(
    () => getUIContextPropsFromCoralContext(newCoralContext),
    [newCoralContext]
  );

  useEffectAtUnmount(() => {
    releaseTargetNode();
  });
  return ReactDOM.createPortal(
    <CoralReactContext.Provider value={newCoralContext}>
      <UIContext.Provider value={newUIContext}>{children}</UIContext.Provider>
    </CoralReactContext.Provider>,
    targetNode
  );
};

export default RenderTargetPortal;
