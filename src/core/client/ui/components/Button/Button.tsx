import cn from "classnames";
import { pick } from "lodash";
import React, { ButtonHTMLAttributes } from "react";

import { withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import BaseButton, { BaseButtonProps } from "../BaseButton";
import * as styles from "./Button.css";

// This should extend from BaseButton instead but we can't because of this bug
// TODO: add bug link.
interface InnerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles & Partial<BaseButtonProps["classes"]>;

  /** If set renders a full width button */
  fullWidth?: boolean;

  /** If set renders a button with inverted borders */
  invert?: boolean;

  /** If set renders a button with primary colors */
  primary?: boolean;

  /** If set renders a button with secondary colors */
  secondary?: boolean;
}

class Button extends React.Component<InnerProps> {
  public render() {
    const {
      classes,
      className,
      fullWidth,
      invert,
      primary,
      secondary,
      disabled,
      ...rest
    } = this.props;

    const rootClassName = cn(classes.root, className, {
      [classes.invert]: invert,
      [classes.fullWidth]: fullWidth,
      [classes.primary]: primary,
      [classes.secondary]: secondary,
      [classes.regular]: !primary && !secondary,
      [classes.disabled]: disabled,
    });

    return (
      <BaseButton
        className={rootClassName}
        classes={pick(classes, "keyboardFocus", "mouseHover")}
        disabled={disabled}
        {...rest}
      />
    );
  }
}

const enhanced = withStyles(styles)(Button);
export type ButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
