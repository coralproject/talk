import cn from "classnames";
import { pick } from "lodash";
import React, { Ref } from "react";

import { withForwardRef, withStyles } from "coral-ui/hocs";
import { Omit, PropTypesOf } from "coral-ui/types";

import BaseButton, { BaseButtonProps } from "../BaseButton";

import styles from "./Button.css";

interface Props extends Omit<BaseButtonProps, "ref"> {
  /** If set renders an anchor tag instead */
  anchor?: boolean;
  href?: string;
  target?: string;
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles & BaseButtonProps["classes"];

  /** Size of the button */
  size?: "small" | "medium" | "large";

  /** Color of the button */
  color?: "default" | "alert" | "emphasis" | "mono";

  /** Variant of the button */
  variant?:
    | "default"
    | "filled"
    | "adornment"
    | "ghost"
    | "underlined"
    | "plain";

  /** If set renders a full width button */
  fullWidth?: boolean;

  /** if set to false, button text will not be uppercase */
  uppercase?: boolean;

  /** If set renders active state e.g. to implement toggle buttons */
  active?: boolean;

  type?: "submit" | "reset" | "button";

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
}

export class Button extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    size: "medium",
    variant: "default",
    color: "default",
    uppercase: true,
  };
  public render() {
    const {
      active,
      classes,
      color,
      className,
      size,
      fullWidth,
      disabled,
      forwardRef,
      variant,
      type,
      uppercase,
      ...rest
    } = this.props;

    const rootClassName = cn(
      classes.root,
      {
        [classes.sizeMedium]: size === "medium",
        [classes.sizeSmall]: size === "small",
        [classes.sizeLarge]: size === "large",
        [classes.colorDefault]: color === "default",
        [classes.colorAlert]: color === "alert",
        [classes.colorEmphasis]: color === "emphasis",
        [classes.colorMono]: color === "mono",
        [classes.variantDefault]: variant === "default",
        [classes.variantFilled]: variant === "filled",
        [classes.variantAdornment]: variant === "adornment",
        [classes.variantGhost]: variant === "ghost",
        [classes.variantUnderlined]: variant === "underlined",
        [classes.variantPlain]: variant === "plain",
        [classes.uppercase]: uppercase,
        [classes.fullWidth]: fullWidth,
        [classes.active]: active,
        [classes.disabled]: disabled,
      },
      className
    );

    return (
      <BaseButton
        className={rootClassName}
        classes={pick(classes, "keyboardFocus", "mouseHover")}
        disabled={disabled}
        ref={forwardRef}
        type={type}
        data-variant={variant}
        data-color={color}
        data-active={active}
        {...rest}
      />
    );
  }
}

const enhanced = withForwardRef(withStyles(styles)(Button));
export type ButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
