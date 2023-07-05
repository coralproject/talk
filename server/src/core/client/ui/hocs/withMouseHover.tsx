/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { MouseEvent, TouchEvent } from "react";
import { DefaultingInferableComponentEnhancer, hoistStatics } from "recompose";

interface InjectedProps {
  onMouseOver: React.EventHandler<MouseEvent<any>>;
  onMouseOut: React.EventHandler<MouseEvent<any>>;
  onTouchEnd: React.EventHandler<TouchEvent<any>>;
  mouseHover: boolean;
}

/**
 * withMouseHover provides a property `MouseHover: boolean`
 * to indicate a that the mouse is hovering the element.
 */
const withMouseHover: DefaultingInferableComponentEnhancer<InjectedProps> =
  hoistStatics<InjectedProps>(
    <T extends InjectedProps>(BaseComponent: React.ComponentType<T>) => {
      // TODO: (cvle) This is a workaround for a typescript bug
      // https://github.com/Microsoft/TypeScript/issues/30762
      const Workaround = BaseComponent as React.ComponentType<InjectedProps>;

      class WithMouseHover extends React.Component<InjectedProps> {
        private lastTouchEndTime = 0;
        public state = {
          mouseHover: false,
        };

        private handleTouchEnd: React.EventHandler<TouchEvent<any>> = (
          event
        ) => {
          if (this.props.onTouchEnd) {
            this.props.onTouchEnd(event);
          }
          this.lastTouchEndTime = new Date().getTime();
        };

        private handleMouseOver: React.EventHandler<MouseEvent<any>> = (
          event
        ) => {
          if (this.props.onMouseOver) {
            this.props.onMouseOver(event);
          }
          const now = new Date().getTime();
          if (now - this.lastTouchEndTime > 750) {
            this.setState({ mouseHover: true });
          }
        };

        private handleMouseOut: React.EventHandler<MouseEvent<any>> = (
          event
        ) => {
          if (this.props.onMouseOut) {
            this.props.onMouseOut(event);
          }
          this.setState({ mouseHover: false });
        };

        public render() {
          return (
            <Workaround
              {...this.props}
              onMouseOver={this.handleMouseOver}
              onMouseOut={this.handleMouseOut}
              onTouchEnd={this.handleTouchEnd}
              mouseHover={this.state.mouseHover}
            />
          );
        }
      }

      return WithMouseHover as React.ComponentClass<any>;
    }
  );

export default withMouseHover;
