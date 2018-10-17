import * as React from "react";
import { MouseEvent, TouchEvent } from "react";
import { DefaultingInferableComponentEnhancer, hoistStatics } from "recompose";

interface InjectedProps {
  onMouseOver: React.EventHandler<MouseEvent<any>>;
  onMouseOut: React.EventHandler<MouseEvent<any>>;
  onTouchEnd: React.EventHandler<TouchEvent<any>>;
  mouseHover: boolean;
}

/**
 * withMouseHover provides a property `MouseHover: boolean`
 * to indicate a focus on the element, that wasn't triggered by mouse
 * or touch.
 */
const withMouseHover: DefaultingInferableComponentEnhancer<
  InjectedProps
> = hoistStatics<InjectedProps>(
  <T extends InjectedProps>(BaseComponent: React.ComponentType<T>) => {
    class WithMouseHover extends React.Component<InjectedProps> {
      public state = {
        mouseHover: false,
        lastTouchEndTime: 0,
      };

      private handleTouchEnd: React.EventHandler<TouchEvent<any>> = event => {
        if (this.props.onTouchEnd) {
          this.props.onTouchEnd(event);
        }
        this.setState({ lastTouchEndTime: new Date().getTime() });
      };

      private handleMouseOver: React.EventHandler<MouseEvent<any>> = event => {
        if (this.props.onMouseOver) {
          this.props.onMouseOver(event);
        }
        const now = new Date().getTime();
        if (now - this.state.lastTouchEndTime > 750) {
          this.setState({ mouseHover: true });
        }
      };

      private handleMouseOut: React.EventHandler<MouseEvent<any>> = event => {
        if (this.props.onMouseOut) {
          this.props.onMouseOut(event);
        }
        this.setState({ mouseHover: false });
      };

      public render() {
        return (
          <BaseComponent
            {...this.props}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            onTouchEnd={this.handleTouchEnd}
            mouseHover={this.state.mouseHover}
          />
        );
      }
    }

    return WithMouseHover as React.ComponentType<any>;
  }
);

export default withMouseHover;
