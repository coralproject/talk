import cn from "classnames";
import React from "react";
import { ButtonHTMLAttributes, StatelessComponent } from "react";

import { withKeyboardFocus, withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import * as styles from "./BaseButton.css";

interface InnerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** If set renders an anchor tag instead */
  anchor?: boolean;

  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  /** This is passed by the `withKeyboardFocus` HOC */
  keyboardFocus: boolean;

  innerRef?: React.RefObject<HTMLDivElement> | any;
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
  type: typeProp,
  innerRef,
  ...rest
}) => {
  let Element = "button";
  if (anchor) {
    Element = "a";
  }

  let type = typeProp;
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
  });

  return <Element {...rest} className={rootClassName} ref={innerRef} />;
};

const enhanced = withStyles(styles)(withKeyboardFocus(BaseButton));
export type BaseButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
