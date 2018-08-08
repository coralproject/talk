import { Component } from "react";

interface PopupProps {
  open?: boolean;
  focus?: boolean;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onLoad?: (e: Event) => void;
  onUnload?: (e: Event) => void;
  onClose?: () => void;
  href: string;
  features?: string;
  title?: string;
}

export default class Popup extends Component<PopupProps> {
  private ref: Window | null = null;
  private detectCloseInterval: any = null;
  private resetCallbackInterval: any = null;

  constructor(props: PopupProps) {
    super(props);

    if (props.open) {
      this.openWindow(props);
    }
  }

  private openWindow(props = this.props) {
    this.ref = window.open(props.href, props.title, props.features);

    this.setCallbacks();

    // For some reasons IE needs a timeout before setting the callbacks...
    setTimeout(() => this.setCallbacks(), 1000);
  }

  private setCallbacks() {
    if (!this.ref) {
      return;
    }
    this.ref!.onload = e => {
      if (this.detectCloseInterval) {
        clearInterval(this.detectCloseInterval);
      }
      this.onLoad(e);
    };

    this.ref!.onfocus = e => {
      this.onFocus(e);
    };

    this.ref!.onblur = e => {
      this.onBlur(e);
    };

    // Use `onunload` instead of `onbeforeunload` which is not supported in iOS
    // Safari.
    this.ref!.onunload = e => {
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

  public componentWillReceiveProps(nextProps: PopupProps) {
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
