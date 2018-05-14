import { Component } from 'react';
import PropTypes from 'prop-types';

export default class Popup extends Component {
  ref = null;
  detectCloseInterval = null;
  resetCallbackInterval = null;

  constructor(props) {
    super(props);

    if (props.open) {
      this.openWindow(props);
    }
  }

  openWindow(props = this.props) {
    this.ref = window.open(props.href, props.title, props.features);

    this.setCallbacks();

    // For some reasons IE needs a timeout before setting the callbacks...
    setTimeout(() => this.setCallbacks(), 1000);
  }

  setCallbacks() {
    this.ref.onload = () => {
      clearInterval(this.detectCloseInterval);
      this.onLoad();
    };

    this.ref.onfocus = () => {
      this.onFocus();
    };

    this.ref.onblur = () => {
      this.onBlur();
    };

    // Use `onunload` instead of `onbeforeunload` which is not supported in iOS
    // Safari.
    this.ref.onunload = () => {
      this.onUnload();

      if (this.resetCallbackInterval) {
        clearInterval(this.resetCallbackInterval);
      }

      this.resetCallbackInterval = setInterval(() => {
        try {
          if (this.ref && this.ref.onload === null) {
            clearInterval(this.resetCallbackInterval);
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
          clearInterval(this.detectCloseInterval);
          this.detectCloseInterval = null;
          this.onClose();
        }
      }, 50);
    };
  }

  closeWindow() {
    if (this.ref) {
      if (!this.ref.closed) {
        this.ref.close();
      }
      this.ref = null;
    }
  }

  focusWindow() {
    if (this.ref && !this.ref.closed) {
      this.ref.focus();
    }
  }

  blurWindow() {
    if (this.ref && !this.ref.closed) {
      this.ref.blur();
    }
  }

  onLoad = () => {
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };

  onUnload = () => {
    if (this.props.onUnload) {
      this.props.onUnload();
    }
  };

  onClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  onBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  componentWillReceiveProps(nextProps) {
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
      this.ref.location.href = nextProps.href;
    }
  }

  componentWillUnmount() {
    this.closeWindow();
  }

  render() {
    return null;
  }
}

Popup.propTypes = {
  open: PropTypes.bool,
  focus: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onLoad: PropTypes.func,
  onUnload: PropTypes.func,
  onClose: PropTypes.func,
  href: PropTypes.string.isRequired,
  features: PropTypes.string,
};
