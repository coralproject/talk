import * as React from "react";
import { FocusEvent } from "react";
import { DefaultingInferableComponentEnhancer, hoistStatics } from "recompose";

interface InjectedProps {
  onFocus: React.EventHandler<FocusEvent<any>>;
  onBlur: React.EventHandler<FocusEvent<any>>;
  keyboardFocus: boolean;
}

/**
 * withKeyboardFocus provides a property `keyboardFocus: boolean`
 * to indicate a focus on the element, that wasn't triggered by mouse
 * or touch.
 */
const withKeyboardFocus: DefaultingInferableComponentEnhancer<
  InjectedProps
> = hoistStatics<InjectedProps>(
  <T extends InjectedProps>(BaseComponent: React.ComponentType<T>) => {
    // TODO: (cvle) This is a workaround for a typescript bug
    // https://github.com/Microsoft/TypeScript/issues/30762
    const Workaround = BaseComponent as React.ComponentType<InjectedProps>;

    class WithKeyboardFocus extends React.Component<any> {
      private lastMouseDownTime: number = 0;
      public state = {
        keyboardFocus: false,
      };

      constructor(props: any) {
        super(props);
        document.addEventListener("mousedown", this.handleMouseDown);
      }

      public componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleMouseDown);
      }

      private handleFocus: React.EventHandler<FocusEvent<any>> = event => {
        if (this.props.onFocus) {
          this.props.onFocus(event);
        }
        const now = new Date().getTime();
        if (now - this.lastMouseDownTime > 750) {
          this.setState({ keyboardFocus: true });
        }
      };

      private handleBlur: React.EventHandler<FocusEvent<any>> = event => {
        if (this.props.onBlur) {
          this.props.onBlur(event);
        }
        this.setState({ keyboardFocus: false });
      };

      private handleMouseDown = () => {
        this.lastMouseDownTime = new Date().getTime();
      };

      public render() {
        return (
          <Workaround
            {...this.props}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            keyboardFocus={this.state.keyboardFocus}
          />
        );
      }
    }

    return WithKeyboardFocus as React.ComponentType<any>;
  }
);

export default withKeyboardFocus;
