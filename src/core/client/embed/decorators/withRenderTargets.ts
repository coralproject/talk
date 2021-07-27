import onIntersectChange from "coral-embed/onIntersectChange";
import { Decorator } from "./types";

interface RenderTargetOptions {
  inViewOnly: boolean;
  disableScroll: boolean;
  style: Partial<CSSStyleDeclaration>;
}

const defaultStyle: Partial<CSSStyleDeclaration> = {
  zIndex: "999999",
  position: "fixed",
  visibility: "hidden",
  pointerEvents: "none",
};

/**
 * This is used to generate the render targets.
 * You can add more here.
 */
const renderTargetsConfig: Record<string, RenderTargetOptions> = {
  modal: {
    inViewOnly: false,
    disableScroll: true,
    style: {
      left: "0px",
      top: "0px",
      width: "100%",
      height: "100%",
    },
  },
  footer: {
    inViewOnly: true,
    disableScroll: false,
    style: {
      left: "0px",
      bottom: "0px",
      height: "60px",
      width: "100%",
    },
  },
};

const renderTargets = Object.keys(renderTargetsConfig);

function createRenderTarget(
  url: string,
  name: string,
  options: RenderTargetOptions
): HTMLIFrameElement {
  const frame = document.createElement("iframe");
  frame.src = url + "&renderTarget=true";
  frame.id = name;
  frame.name = name;
  (frame as any).allowTransparency = "true";
  frame.frameBorder = "0";
  const style = {
    ...defaultStyle,
    ...options.style,
  };
  Object.keys(style).forEach((k) => {
    (frame.style as any)[k] = (style as any)[k];
  });
  return frame;
}

function initRenderTargets(
  url: string,
  id: string
): Record<string, HTMLIFrameElement> {
  const result: Record<string, HTMLIFrameElement> = {};
  renderTargets.forEach((key) => {
    const frame = createRenderTarget(
      url,
      `${id}_iframe_${key}`,
      renderTargetsConfig[key]
    );
    result[key] = frame;
    document.body.appendChild(frame);
  });
  return result;
}

/**
 * withRenderTargets creates and manages render targets as defined in
 * `renderTargetsConfig`.
 *
 * @param url url to stream embed
 * @param id id of stream embed
 */
const withRenderTargets = (url: string, id: string): Decorator => (pym) => {
  const frames = initRenderTargets(url, id);
  const targetsDisablingScroll: string[] = [];
  const needObserver = renderTargets.some(
    (s) => renderTargetsConfig[s].inViewOnly
  );
  const disconnectObserver = !needObserver
    ? () => {}
    : onIntersectChange(
        pym.el,
        (isIntersecting) => {
          renderTargets.forEach((target) => {
            const frame = frames[target];
            if (!frame || !renderTargetsConfig[target].inViewOnly) {
              return;
            }
            frame.style.display = isIntersecting ? "block" : "none";
          });
          // eslint-disable-next-line no-console
          console.log(isIntersecting);
        },
        { rootMargin: "-100px -20px" }
      );

  if (!document.getElementById("coral-embed-style")) {
    const headElements = document.getElementsByTagName("head");
    if (headElements.length > 0) {
      const head = headElements[0];
      const style = document.createElement("style");
      style.id = "coral-embed-style";
      style.type = "text/css";
      style.innerHTML =
        "body.coralBodyNoScroll { overflow: hidden; !important }";
      head.appendChild(style);
    } else {
      // eslint-disable-next-line no-console
      console.warn("Coral: Head Element was not found.");
    }
  }

  // Listen to frame actions.
  pym.onMessage("renderTargetAction", (raw: string) => {
    const { action, target } = JSON.parse(raw);
    const frame = frames[target];
    const disableScroll = renderTargetsConfig[target].disableScroll;
    if (!frame) {
      throw new Error(`Iframe ${target} not found`);
    }
    switch (action) {
      case "show": {
        frame.style.visibility = "visible";
        frame.style.pointerEvents = "auto";
        if (disableScroll) {
          targetsDisablingScroll.push(target);
          if (targetsDisablingScroll.length === 1) {
            window.document.body.className = `${window.document.body.className} coralBodyNoScroll`;
          }
        }
        break;
      }
      case "hide": {
        frame.style.visibility = "hidden";
        frame.style.pointerEvents = "none";
        if (disableScroll) {
          const index = targetsDisablingScroll.indexOf(target);
          if (index > -1) {
            targetsDisablingScroll.splice(index, 1);
          }
          if (targetsDisablingScroll.length === 0) {
            window.document.body.className = window.document.body.className.replace(
              / ?coralBodyNoScroll/g,
              ""
            );
          }
        }
        break;
      }
      default:
        throw new Error(`Unknown render target action ${action}`);
    }
  });

  // Cleanup frames.
  return () => {
    disconnectObserver();
    Object.keys(frames).forEach((key) => {
      const parentNode = frames[key].parentNode;
      if (parentNode) {
        parentNode.removeChild(frames[key]);
      }
    });
  };
};

export default withRenderTargets;
