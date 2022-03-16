import { FunctionComponent, useEffect } from "react";

import usePrevious from "coral-framework/hooks/usePrevious";
import { useUIContext } from "coral-ui/components/v2/UIContext";

interface WindowFeatures {
  resizable: number;
  menubar: number;
  width: number;
  height: number;
  centered: boolean;
  innerWidth?: number;
}

interface PopupProps {
  open?: boolean;
  focus?: boolean;
  /** onFocus event, does not work on cross origin popups! */
  onFocus?: (e: FocusEvent) => void;
  /** onBlur event, does not work on cross origin popups! */
  onBlur?: (e: FocusEvent) => void;
  /** onLoad event, does not work on cross origin popups! */
  onLoad?: (e: Event) => void;
  /** onUnload event, does not work on cross origin popups! */
  onUnload?: (e: Event) => void;
  onClose?: () => void;
  href: string;
  features?: Partial<WindowFeatures>;
  title?: string;
}

function reconcileFeatures(
  window: Window,
  { centered, ...options }: WindowFeatures
): string {
  const features: Record<string, any> = {
    ...options,
    left: 0,
    top: 0,
  };
  if (centered) {
    const winLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const winTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY;

    // If we're centered, then apply the features left/right flags.
    features.left = winLeft + window.outerWidth / 2 - options.width / 2;
    features.top = winTop + 100;
  }

  return Object.keys(features)
    .reduce(
      (acc, key) => acc.concat([`${key}=${features[key]}`]),
      [] as string[]
    )
    .join(",");
}

const defaultFeatures: WindowFeatures = {
  resizable: 0,
  menubar: 0,
  width: 350,
  height: 450,
  centered: true,
};

const Popup: FunctionComponent<PopupProps> = (props) => {
  let ref: Window | null = null;
  let detectCloseInterval: any = null;
  let resetCallbackInterval: any = null;
  const { renderWindow } = useUIContext();
  const previousOpen = usePrevious(props.open);
  const previousFocus = usePrevious(props.focus);
  const previousHref = usePrevious(props.href);

  const openWindow = ({ features = {}, href, title } = props) => {
    const opts: WindowFeatures = {
      ...defaultFeatures,
      ...features,
    };

    ref = renderWindow.open("", title, reconcileFeatures(renderWindow, opts));

    attemptSetCallbacks();

    ref!.location.href = href;
  };

  /**
   * attemptSetCallbacks will try to call setCallbacks wrapped in a try/catch
   * block. In some situations, like when the user logs in via a external
   * provider, a popup may become a cross-origin frame, which we don't have
   * access to directly. This resolves that issue by swallowing the error here
   * and logging it.
   */
  const attemptSetCallbacks = () => {
    try {
      setCallbacks();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const setCallbacks = () => {
    if (!ref) {
      return;
    }
    ref.onload = (e) => {
      onLoad(e);
    };

    ref.onfocus = (e) => {
      onFocus(e);
    };

    ref.onblur = (e) => {
      onBlur(e);
    };

    // Use `onunload` instead of `onbeforeunload` which is not supported in iOS
    // Safari.
    ref.onunload = (e) => {
      onUnload(e);

      if (resetCallbackInterval) {
        clearInterval(resetCallbackInterval);
      }

      resetCallbackInterval = setInterval(() => {
        try {
          if (ref && ref.onload === null) {
            if (resetCallbackInterval) {
              clearInterval(resetCallbackInterval);
            }
            resetCallbackInterval = null;
            setCallbacks();
          }
        } catch (err) {
          // We could be getting a security exception here if the login page
          // gets redirected to another domain to authenticate.
        }
      }, 50);

      if (detectCloseInterval) {
        clearInterval(detectCloseInterval);
      }

      detectCloseInterval = setInterval(() => {
        if (!ref || ref.closed) {
          if (detectCloseInterval) {
            clearInterval(detectCloseInterval);
          }
          detectCloseInterval = null;
          onClose();
        }
      }, 50);
    };
  };

  const closeWindow = () => {
    if (ref) {
      if (!ref.closed) {
        ref.close();
      }
      ref = null;
    }
  };

  const focusWindow = () => {
    if (ref && !ref.closed) {
      ref.focus();
    }
  };

  const blurWindow = () => {
    if (ref && !ref.closed) {
      ref.blur();
    }
  };

  const onLoad = (e: Event) => {
    if (props.onLoad) {
      props.onLoad(e);
    }
  };

  const onUnload = (e: Event) => {
    if (props.onUnload) {
      props.onUnload(e);
    }
  };

  const onClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const onFocus = (e: FocusEvent) => {
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const onBlur = (e: FocusEvent) => {
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  useEffect(() => {
    if (props.open && !ref && !previousOpen) {
      openWindow(props);
    }
    if (previousOpen && !props.open) {
      closeWindow();
    }
  }, [props.open, openWindow, closeWindow]);

  useEffect(() => {
    if (!previousFocus && props.focus) {
      focusWindow();
    }

    if (previousFocus && !props.focus) {
      blurWindow();
    }
  }, [props.focus, focusWindow, blurWindow]);

  useEffect(() => {
    if (previousHref !== props.href && ref) {
      ref.location.href = props.href;
    }
  }, [props.href]);

  useEffect(() => {
    if (props.open) {
      openWindow(props);
    }
    return () => {
      closeWindow();
    };
  }, []);

  return null;
};

export default Popup;
