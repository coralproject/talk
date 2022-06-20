import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

import waitAndRequestIdleCallback, {
  Cancel,
} from "coral-common/utils/waitAndRequestIdleCallback";
import {
  CoralReactContext,
  useCoralContext,
} from "coral-framework/lib/bootstrap";
import { getUIContextPropsFromCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { RTE_ELEMENT_ID } from "coral-stream/constants";
import { UIContext } from "coral-ui/components/v2";
import CoralWindowContainer from "coral-ui/encapsulation/CoralWindowContainer";
import CSSAsset from "coral-ui/encapsulation/CSSAsset";
import { useEncapsulationContext } from "coral-ui/encapsulation/EncapsulationContext";

const HEIGHT_POLLING_INTERVAL = 200;

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

interface IframeEncapsulationProps {
  /** This is called when the content has been loaded. */
  onLoad?: () => void;
  children?: React.ReactNode;
}

const iframeStyle = { display: "block" };
const emptyArray: CSSAsset[] = [];

/**
 * Sets up Iframe encapsulation.
 */
const IframeEncapsulation: FunctionComponent<IframeEncapsulationProps> = ({
  onLoad,
  children,
}) => {
  const encapsulation = useEncapsulationContext();

  // Combined assets.
  const assets = useMemo(
    () => [
      ...(encapsulation.cssAssets || emptyArray),
      ...(encapsulation.fontsCSSAssets || emptyArray),
      ...(encapsulation.customCSSAssets || emptyArray),
    ],
    [
      encapsulation.cssAssets,
      encapsulation.fontsCSSAssets,
      encapsulation.customCSSAssets,
    ]
  );

  /** Keep track on how many assets have been loaded. */
  const assetsLoaded = useRef(0);

  // Remember initial assets.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialAssetsCount = useMemo(() => assets.length, []);

  // Handle loading state.
  const [loaded, setLoaded] = useState(false);
  const handleOnLoad = useCallback(() => {
    assetsLoaded.current++;
    if (assetsLoaded.current === initialAssetsCount) {
      setLoaded(true);
    }
  }, [initialAssetsCount]);

  // Target for React to render into.
  const [target, setTarget] = useState<Element | null>(null);
  const handleRef = useCallback((ref: HTMLIFrameElement | null) => {
    if (ref) {
      const win = ref.contentWindow!;
      const load = () => {
        const div = win.document.createElement("div");
        win.document.body.appendChild(div);
        setTarget(div);
        win.document.body.style.margin = "0";
      };
      if (win.document.readyState === "complete") {
        load();
      } else {
        // Firefox needs a bit, till we can render into it.
        win.onload = load;
      }
    }
  }, []);

  // Current height of CoralWindowContainer, we use polling to figure out changes.
  const [height, setHeight] = useState<number | null>(null);
  const pollingTimeoutRef = useRef<Cancel | null>(null);

  // Ref to CoralWindowContainer.
  const handleContainerRef = useCallback((ref: HTMLDivElement | null) => {
    if (pollingTimeoutRef.current) {
      pollingTimeoutRef.current();
      pollingTimeoutRef.current = null;
    }
    if (ref) {
      const callback = () => {
        setHeight(ref.getBoundingClientRect().height);
        pollingTimeoutRef.current = waitAndRequestIdleCallback(
          callback,
          HEIGHT_POLLING_INTERVAL
        );
      };
      // Run first callback, after one frame, after that use polling interval.
      const timeout = setTimeout(callback, 0);
      pollingTimeoutRef.current = () => clearTimeout(timeout);
    }
  }, []);

  // We call onLoad when `height` has been first determined.
  useEffect(() => {
    if (height !== null && onLoad) {
      onLoad();
    }
  }, [height, onLoad]);

  return (
    <>
      <iframe
        title="RTE"
        src="about:blank"
        ref={handleRef}
        frameBorder={0}
        width="100%"
        height={height || 0}
        scrolling="no"
        style={iframeStyle}
        id={RTE_ELEMENT_ID}
      ></iframe>
      {target && (
        <TargetPortal target={target}>
          {assets.map((asset) => (
            <link
              key={asset.href}
              href={asset.href}
              onLoad={handleOnLoad}
              onError={handleOnLoad}
              rel="stylesheet"
            />
          ))}
          {loaded && (
            <CoralWindowContainer
              className={encapsulation.containerClassName}
              style={encapsulation.style}
              ref={handleContainerRef}
            >
              {children}
            </CoralWindowContainer>
          )}
        </TargetPortal>
      )}
    </>
  );
};

export default IframeEncapsulation;
