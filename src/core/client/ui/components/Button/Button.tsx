import cn from "classnames";
import { pick } from "lodash";
import React, { ButtonHTMLAttributes, Ref } from "react";

import { withForwardRef, withStyles } from "talk-ui/hocs";
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

  /** Size of the button */
  size?: "small" | "regular" | "large";

  /** Color of the button */
  color?: "regular" | "primary" | "error" | "success";

  /** Variant of the button */
  variant?: "regular" | "filled" | "outlined" | "ghost";

  /** If set renders a full width button */
  fullWidth?: boolean;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
}

export class Button extends React.Component<InnerProps> {
  public static defaultProps: Partial<InnerProps> = {
    size: "regular",
    variant: "regular",
    color: "regular",
  };
  public render() {
    const {
      classes,
      color,
      className,
      size,
      fullWidth,
      disabled,
      forwardRef,
      variant,
      ...rest
    } = this.props;

    const rootClassName = cn(classes.root, className, {
      [classes.sizeRegular]: size === "regular",
      [classes.sizeSmall]: size === "small",
      [classes.sizeLarge]: size === "large",
      [classes.colorRegular]: color === "regular",
      [classes.colorPrimary]: color === "primary",
      [classes.colorError]: color === "error",
      [classes.colorSuccess]: color === "success",
      [classes.variantRegular]: variant === "regular",
      [classes.variantFilled]: variant === "filled",
      [classes.variantOutlined]: variant === "outlined",
      [classes.variantGhost]: variant === "ghost",
      [classes.fullWidth]: fullWidth,
      [classes.disabled]: disabled,
    });

    return (
      <BaseButton
        className={rootClassName}
        classes={pick(classes, "keyboardFocus", "mouseHover")}
        disabled={disabled}
        forwardRef={forwardRef}
        {...rest}
      />
    );
  }
}

const enhanced = withForwardRef(withStyles(styles)(Button));
export type ButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
