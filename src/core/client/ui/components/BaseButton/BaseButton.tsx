import cn from "classnames";
import React, {
  ButtonHTMLAttributes,
  EventHandler,
  FocusEvent,
  MouseEvent,
  Ref,
  StatelessComponent,
  TouchEvent,
} from "react";

import {
  withForwardRef,
  withKeyboardFocus,
  withMouseHover,
  withStyles,
} from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import styles from "./BaseButton.css";

interface InnerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** If set renders an anchor tag instead */
  anchor?: boolean;
  href?: string;
  target?: string;

  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;

  type?: "submit" | "reset" | "button";

  // These handlers are passed down by the `withMouseHover` HOC.
  mouseHover: boolean;
  onMouseOver: React.EventHandler<MouseEvent<HTMLElement>>;
  onMouseOut: React.EventHandler<MouseEvent<HTMLElement>>;
  onTouchEnd: React.EventHandler<TouchEvent<HTMLElement>>;

  // These handlers are passed down by the `withKeyboardFocus` HOC.
  onFocus: EventHandler<FocusEvent<HTMLElement>>;
  onBlur: EventHandler<FocusEvent<HTMLElement>>;
  keyboardFocus: boolean;
}

/**
 * A button whose styling is stripped off to a minimum and supports
 * keyboard focus. It is the base for our other buttons.
 */
const BaseButton: StatelessComponent<InnerProps> = ({
  anchor,
  className,
  classes,
  keyboardFocus,
  mouseHover,
  forwardRef,
  type,
  ...rest
}) => {
  let Element = "button";

  if (anchor) {
    Element = "a";
  }

  if (anchor && type) {
    // tslint:disable:next-line: no-console
    console.warn(
      "BaseButton used as anchor does not support the `type` property"
    );
  } else if (type === undefined) {
    // Default to button
    type = "button";
  }

  const rootClassName = cn(classes.root, className, {
    [classes.keyboardFocus]: keyboardFocus,
    [classes.mouseHover]: mouseHover,
  });

  return (
    <Element {...rest} className={rootClassName} ref={forwardRef} type={type} />
  );
};

const enhanced = withForwardRef(
  withStyles(styles)(withMouseHover(withKeyboardFocus(BaseButton)))
);
export type BaseButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
