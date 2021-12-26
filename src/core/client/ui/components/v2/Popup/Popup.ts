import { Component } from "react";
import withUIContext from "../UIContext/withUIContext";

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
  window: Window;
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

export class Popup extends Component<PopupProps> {
  private ref: Window | null = null;
  private detectCloseInterval: any = null;
  private resetCallbackInterval: any = null;

  constructor(props: PopupProps) {
    super(props);

    if (props.open) {
      this.openWindow(props);
    }
  }

  public static defaultFeatures: WindowFeatures = {
    resizable: 0,
    menubar: 0,
    width: 350,
    height: 450,
    centered: true,
  };

  private openWindow({ features = {}, href, title } = this.props) {
    const opts: WindowFeatures = {
      ...Popup.defaultFeatures,
      ...features,
    };

    this.ref = this.props.window.open(
      "",
      title,
      reconcileFeatures(this.props.window, opts)
    );

    this.attemptSetCallbacks();
    this.ref!.location.href = href;
  }

  /**
   * attemptSetCallbacks will try to call setCallbacks wrapped in a try/catch
   * block. In some situations, like when the user logs in via a external
   * provider, a popup may become a cross-origin frame, which we don't have
   * access to directly. This resolves that issue by swallowing the error here
   * and logging it.
   */
  private attemptSetCallbacks() {
    try {
      this.setCallbacks();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  private setCallbacks() {
    if (!this.ref) {
      return;
    }
    this.ref.onload = (e) => {
      this.onLoad(e);
    };

    this.ref.onfocus = (e) => {
      this.onFocus(e);
    };

    this.ref.onblur = (e) => {
      this.onBlur(e);
    };

    // Use `onunload` instead of `onbeforeunload` which is not supported in iOS
    // Safari.
    this.ref.onunload = (e) => {
      this.onUnload(e);

      if (this.resetCallbackInterval) {
        clearInterval(this.resetCallbackInterval);
      }

      this.resetCallbackInterval = setInterval(() => {
        try {
          if (this.ref && this.ref.onload === null) {
            if (this.resetCallbackInterval) {
              clearInterval(this.resetCallbackInterval);
            }
            this.resetCallbackInterval = null;
            this.setCallbacks();
          }
        } catch (err) {
          // We could be getting a security exception here if the login page
          // gets redirected to another domain to authenticate.
        }
      }, 50);

      if (this.detectCloseInterval) {
        clearInterval(this.detectCloseInterval);
      }

      this.detectCloseInterval = setInterval(() => {
        if (!this.ref || this.ref.closed) {
          if (this.detectCloseInterval) {
            clearInterval(this.detectCloseInterval);
          }
          this.detectCloseInterval = null;
          this.onClose();
        }
      }, 50);
    };
  }

  private closeWindow() {
    if (this.ref) {
      if (!this.ref.closed) {
        this.ref.close();
      }
      this.ref = null;
    }
  }

  private focusWindow() {
    if (this.ref && !this.ref.closed) {
      this.ref.focus();
    }
  }

  private blurWindow() {
    if (this.ref && !this.ref.closed) {
      this.ref.blur();
    }
  }

  private onLoad = (e: Event) => {
    if (this.props.onLoad) {
      this.props.onLoad(e);
    }
  };

  private onUnload = (e: Event) => {
    if (this.props.onUnload) {
      this.props.onUnload(e);
    }
  };

  private onClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  private onFocus = (e: FocusEvent) => {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  private onBlur = (e: FocusEvent) => {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  public UNSAFE_componentWillReceiveProps(nextProps: PopupProps) {
    if (nextProps.open && !this.ref) {
      this.openWindow(nextProps);
    }

    if (this.props.open && !nextProps.open) {
      this.closeWindow();
    }

    if (!this.props.focus && nextProps.focus) {
      this.focusWindow();
    }

    if (this.props.focus && !nextProps.focus) {
      this.blurWindow();
    }

    if (this.props.href !== nextProps.href) {
      this.ref!.location.href = nextProps.href;
    }
  }

  public componentWillUnmount() {
    this.closeWindow();
  }

  public render() {
    return null;
  }
}

const enhanced = withUIContext(({ renderWindow }) => ({
  window: renderWindow,
}))(Popup);

export default enhanced;
