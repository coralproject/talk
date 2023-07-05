import cn from "classnames";
import { Link } from "found";
import React, {
  ButtonHTMLAttributes,
  EventHandler,
  FocusEvent,
  FunctionComponent,
  MouseEvent,
  Ref,
  TouchEvent,
} from "react";

import {
  withForwardRef,
  withKeyboardFocus,
  withMouseHover,
} from "coral-ui/hocs";
import useStyles from "coral-ui/hooks/useStyles";
import { PropTypesOf } from "coral-ui/types";

import styles from "./BaseButton.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** If set renders an anchor tag instead */
  anchor?: boolean;
  href?: string;
  target?: string;
  rel?: string;

  to?: string;

  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes?: Partial<typeof styles>;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement | HTMLAnchorElement>;

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
const BaseButton: FunctionComponent<Props> = ({
  anchor,
  className,
  classes,
  keyboardFocus,
  mouseHover,
  forwardRef,
  type,
  ...rest
}) => {
  const css = useStyles(styles, classes);

  let Element: React.ComponentType<
    React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> &
      React.ClassAttributes<HTMLButtonElement | HTMLAnchorElement>
  > = "button" as any;

  if (rest.to) {
    Element = Link as any;
  }

  if (anchor) {
    Element = "a" as any;
  }

  if (anchor && type) {
    // eslint-disable-next-line no-console
    console.warn(
      "BaseButton used as anchor does not support the `type` property"
    );
  } else if (!anchor && type === undefined) {
    // Default to button
    type = "button";
  }

  /**
   * Added as a security workaround as per:
   *
   * https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
   */
  if (rest.target === "_blank") {
    rest.rel = "noopener noreferrer";
  }

  const rootClassName = cn(css.root, className, {
    [css.keyboardFocus]: keyboardFocus,
    [css.mouseHover]: mouseHover,
  });

  return (
    <Element {...rest} className={rootClassName} ref={forwardRef} type={type} />
  );
};

const enhanced = withForwardRef(withMouseHover(withKeyboardFocus(BaseButton)));

export type BaseButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
