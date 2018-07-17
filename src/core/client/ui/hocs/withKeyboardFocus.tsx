import * as React from "react";
import { FocusEvent, MouseEvent } from "react";
import { hoistStatics } from "recompose";

interface InjectedProps {
  onFocus: React.EventHandler<FocusEvent<any>>;
  onBlur: React.EventHandler<FocusEvent<any>>;
  onMouseDown: React.EventHandler<MouseEvent<any>>;
  keyboardFocus: boolean;
}

/**
 * withKeyboardFocus provides a property `keyboardFocus: boolean`
 * to indicate a focus on the element, that wasn't triggered by mouse
 * or touch.
 */
const withKeyboardFocus = hoistStatics<InjectedProps>(
  <T extends InjectedProps>(WrappedComponent: React.ComponentType<T>) => {
    class WithKeyboardFocus extends React.Component<any> {
      public state = {
        keyboardFocus: false,
        lastMouseDownTime: 0,
      };

      private handleFocus: React.EventHandler<FocusEvent<any>> = event => {
        if (this.props.onFocus) {
          this.props.onFocus(event);
        }
        const now = new Date().getTime();
        if (now - this.state.lastMouseDownTime > 750) {
          this.setState({ keyboardFocus: true });
        }
      };

      private handleBlur: React.EventHandler<FocusEvent<any>> = event => {
        if (this.props.onBlur) {
          this.props.onBlur(event);
        }
        this.setState({ keyboardFocus: false });
      };

      private handleMouseDown: React.EventHandler<MouseEvent<any>> = event => {
        if (this.props.onMouseDown) {
          this.props.onMouseDown(event);
        }
        this.setState({ lastMouseDownTime: new Date().getTime() });
      };

      public render() {
        return (
          <WrappedComponent
            {...this.props}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMouseDown={this.handleMouseDown}
            keyboardFocus={this.state.keyboardFocus}
          />
        );
      }
    }

    return WithKeyboardFocus as React.ComponentType<any>;
  }
);

// TODO: workaround, add bug link.
export default withKeyboardFocus as <P extends Partial<InjectedProps>>(
  WrappedComponent: React.ComponentType<P>
) => React.ComponentType<P>;
