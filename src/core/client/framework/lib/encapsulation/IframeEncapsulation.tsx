import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

import {
  CoralReactContext,
  useCoralContext,
} from "coral-framework/lib/bootstrap";
import { getUIContextPropsFromCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { UIContext } from "coral-ui/components/v2";

import { useEncapsulationContext } from "./EncapsulationContext";

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

/**
 * Sets up Iframe encapsulation.
 */
const IframeEncapsulation: FunctionComponent<IframePortalProps> = (props) => {
  const encapsulation = useEncapsulationContext();
  const cssAssets = encapsulation.cssAssets || [];
  const fontsCSSAssets = encapsulation.fontsCSSAssets || [];
  const customCSSAssets = encapsulation.customCSSAssets || [];
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

  const [height, setHeight] = useState(0);
  const pollingTimeoutRef = useRef<any>(null);
  const handleContainerRef = (ref: HTMLDivElement | null) => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
    if (ref) {
      const callback = () => {
        setHeight(ref.getBoundingClientRect().height);
        pollingTimeoutRef.current = setTimeout(callback, 100);
      };
      callback();
    }
  };
  return (
    <>
      <iframe
        title="RTE"
        src="about:blank"
        ref={handleRef}
        frameBorder={0}
        width="100%"
        height={height}
      ></iframe>
      {target && (
        <TargetPortal target={target}>
          <div
            id="coral"
            className={encapsulation.containerClassName}
            style={encapsulation.style}
            ref={handleContainerRef}
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

export default IframeEncapsulation;
