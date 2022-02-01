import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import ReactDOM from "react-dom";

import {
  CoralReactContext,
  useCoralContext,
} from "coral-framework/lib/bootstrap";
import { getUIContextPropsFromCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { UIContext } from "coral-ui/components/v2";
import { useShadowRootDerivedProps } from "coral-ui/shadow/ReactShadowRoot";

interface TargetPortalProps {
  target: Element;
  children?: React.ReactNode;
}

const TargetPortal: FunctionComponent<TargetPortalProps> = ({
  target,
  children,
}) => {
  const coralContext = useCoralContext();
  const window = target.ownerDocument.defaultView!;
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
  return ReactDOM.createPortal(
    <CoralReactContext.Provider value={newCoralContext}>
      <UIContext.Provider value={newUIContext}>{children}</UIContext.Provider>
    </CoralReactContext.Provider>,
    target
  );
};

interface IframePortalProps {
  children?: React.ReactNode;
}

const IframePortal: FunctionComponent<IframePortalProps> = (props) => {
  const derivedProps = useShadowRootDerivedProps();
  const cssAssets = derivedProps.cssAssets || [];
  const fontsCSSAssets = derivedProps.fontsCSSAssets || [];
  const customCSSAssets = derivedProps.customCSSAssets || [];
  const [target, setTarget] = useState<Element | null>(null);
  const handleRef = useCallback((ref: HTMLIFrameElement | null) => {
    if (ref) {
      const load = () => {
        const div = win.document.createElement("div");
        win.document.body.appendChild(div);
        setTarget(div);
        win.document.body.style.margin = "0";
      };
      const win = ref.contentWindow!;
      if (win.document.readyState === "complete") {
        load();
      } else {
        win.onload = load;
      }
    }
  }, []);
  return (
    <>
      <iframe
        title="RTE"
        src="about:blank"
        ref={handleRef}
        frameBorder={0}
        width="100%"
      ></iframe>
      {target && (
        <TargetPortal target={target}>
          <div
            id="coral"
            className={derivedProps.containerClassName}
            style={derivedProps.style}
          >
            {fontsCSSAssets.map((asset) => (
              <link key={asset.href} href={asset.href} rel="stylesheet" />
            ))}
            {cssAssets.map((asset) => (
              <link key={asset.href} href={asset.href} rel="stylesheet" />
            ))}
            {customCSSAssets.map((asset) => (
              <link key={asset.href} href={asset.href} rel="stylesheet" />
            ))}
            {props.children}
          </div>
        </TargetPortal>
      )}
    </>
  );
};

export default IframePortal;
