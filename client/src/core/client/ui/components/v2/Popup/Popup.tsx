import {
  FunctionComponent,
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

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

const Popup: FunctionComponent<PopupProps> = ({
  open,
  focus,
  onFocus,
  onBlur,
  onLoad,
  onUnload,
  onClose,
  href,
  features,
  title,
}) => {
  const ref = useRef<Window | null>(null);
  const detectCloseInterval: MutableRefObject<null | NodeJS.Timeout> =
    useRef(null);
  const resetCallbackInterval: MutableRefObject<null | NodeJS.Timeout> =
    useRef(null);
  const { renderWindow } = useUIContext();
  const previousOpen = usePrevious(open);
  const previousFocus = usePrevious(focus);
  const previousHref = usePrevious(href);

  const setCallbacks = useCallback(() => {
    if (!ref.current) {
      return;
    }
    ref.current.onload = (e) => {
      onLoadCallback(e);
    };

    ref.current.onfocus = (e) => {
      onFocusCallback(e);
    };

    ref.current.onblur = (e) => {
      onBlurCallback(e);
    };

    // Use `onunload` instead of `onbeforeunload` which is not supported in iOS
    // Safari.
    ref.current.onunload = (e) => {
      onUnloadCallback(e);

      if (resetCallbackInterval.current) {
        clearInterval(resetCallbackInterval.current);
      }

      resetCallbackInterval.current = setInterval(() => {
        try {
          if (ref.current && ref.current.onload === null) {
            if (resetCallbackInterval.current) {
              clearInterval(resetCallbackInterval.current);
            }
            resetCallbackInterval.current = null;
            setCallbacks();
          }
        } catch (err) {
          // We could be getting a security exception here if the login page
          // gets redirected to another domain to authenticate.
        }
      }, 50);

      if (detectCloseInterval.current) {
        clearInterval(detectCloseInterval.current);
      }

      detectCloseInterval.current = setInterval(() => {
        if (!ref.current || ref.current.closed) {
          if (detectCloseInterval.current) {
            clearInterval(detectCloseInterval.current);
          }
          detectCloseInterval.current = null;
          onCloseCallback();
        }
      }, 50);
    };
  }, [ref]);

  /**
   * attemptSetCallbacks will try to call setCallbacks wrapped in a try/catch
   * block. In some situations, like when the user logs in via a external
   * provider, a popup may become a cross-origin frame, which we don't have
   * access to directly. This resolves that issue by swallowing the error here
   * and logging it.
   */
  const attemptSetCallbacks = useCallback(() => {
    try {
      setCallbacks();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, [setCallbacks]);

  const openWindow = useCallback(() => {
    const featuresInOpen = features ? features : {};
    const opts: WindowFeatures = {
      ...defaultFeatures,
      ...featuresInOpen,
    };

    ref.current = renderWindow.open(
      "",
      title,
      reconcileFeatures(renderWindow, opts)
    );

    attemptSetCallbacks();

    ref.current!.location.href = href;
  }, [renderWindow, ref, attemptSetCallbacks, href, title, reconcileFeatures]);

  // have to use layouteffect here so that fires synchronously and popup
  // opening is tied to the user event and is not blocked
  useLayoutEffect(() => {
    if (open && !ref.current && !previousOpen) {
      openWindow();
    }
  }, [open, ref, openWindow]);

  const closeWindow = useCallback(() => {
    if (ref.current) {
      if (!ref.current.closed) {
        ref.current.close();
      }
      ref.current = null;
    }
  }, [ref]);

  useEffect(() => {
    if (previousOpen && !open) {
      closeWindow();
    }
  }, [previousOpen, open, closeWindow]);

  const focusWindow = useCallback(() => {
    if (ref.current && !ref.current.closed) {
      ref.current.focus();
    }
  }, [ref]);

  const blurWindow = useCallback(() => {
    if (ref.current && !ref.current.closed) {
      ref.current.blur();
    }
  }, [ref]);

  const onLoadCallback = useCallback(
    (e: Event) => {
      if (onLoad) {
        onLoad(e);
      }
    },
    [onLoad]
  );

  const onUnloadCallback = useCallback(
    (e: Event) => {
      if (onUnload) {
        onUnload(e);
      }
    },
    [onUnload]
  );

  const onCloseCallback = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const onFocusCallback = useCallback(
    (e: FocusEvent) => {
      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus]
  );

  const onBlurCallback = useCallback(
    (e: FocusEvent) => {
      if (onBlur) {
        onBlur(e);
      }
    },
    [onBlur]
  );

  useEffect(() => {
    if (!previousFocus && focus) {
      focusWindow();
    }

    if (previousFocus && !focus) {
      blurWindow();
    }
  }, [focus, focusWindow, blurWindow]);

  useEffect(() => {
    if (previousHref !== href && ref.current) {
      ref.current.location.href = href;
    }
  }, [href, ref]);

  useLayoutEffect(() => {
    if (open) {
      openWindow();
    }
  }, []);

  useEffect(() => {
    return () => {
      closeWindow();
    };
  }, []);

  return null;
};

export default Popup;
