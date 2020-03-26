import cn from "classnames";
import { pick } from "lodash";
import React, { Ref } from "react";

import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import BaseButton, { BaseButtonProps } from "../BaseButton";

import styles from "./Button.css";

interface Props extends Omit<BaseButtonProps, "ref"> {
  /** If set renders an anchor tag instead */
  anchor?: boolean;
  href?: string;
  target?: string;
  to?: string;
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles & BaseButtonProps["classes"];

  /** Size of the button */
  size?: "regular" | "large";

  /** Color of the button */
  color?: "regular" | "alert" | "mono" | "alt" | "dark";

  /** Variant of the button */
  variant?:
    | "regular"
    | "flat"
    | "outline"
    | "text"
    | "underlined"
    | "textUnderlined";

  /* button is attached to the LEFT of an input element */
  adornmentLeft?: boolean;

  /* button is attached to the RIGHT of an input element */
  adornmentRight?: boolean;

  /* button has a ButtonIcon to the left of the text */
  iconLeft?: boolean;

  /* button has a ButtonIcon to the right of the text */
  iconRight?: boolean;

  /** If set renders a full width button */
  fullWidth?: boolean;

  /** if set to false, button text will not be uppercase */
  uppercase?: boolean;

  /** If set renders active state e.g. to implement toggle buttons */
  active?: boolean;

  type?: "submit" | "reset" | "button";

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;

  /* if true adds a link-style underline */
  underline?: boolean;
}

export class Button extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    size: "regular",
    variant: "regular",
    color: "regular",
    uppercase: true,
  };
  public render() {
    const {
      active,
      classes,
      color,
      className,
      children,
      size,
      fullWidth,
      disabled,
      forwardRef,
      variant,
      type,
      uppercase,
      iconLeft,
      iconRight,
      adornmentLeft,
      adornmentRight,
      underline,
      to,
      ...rest
    } = this.props;

    const rootClassName = cn(
      classes.root,
      {
        [classes.sizeRegular]: size === "regular",
        [classes.sizeLarge]: size === "large",
        [classes.colorRegular]: color === "regular",
        [classes.colorAlert]: color === "alert",
        [classes.colorAlt]: color === "alt",
        [classes.colorMono]: color === "mono",
        [classes.colorDark]: color === "dark",
        [classes.variantRegular]: variant === "regular",
        [classes.variantFlat]: variant === "flat",
        [classes.variantOutline]: variant === "outline",
        [classes.variantText]: variant === "text",
        [classes.variantUnderlined]: variant === "underlined",
        [classes.variantTextUnderlined]: variant === "textUnderlined",
        [classes.uppercase]: uppercase,
        [classes.fullWidth]: fullWidth,
        [classes.active]: active,
        [classes.disabled]: disabled,
        [classes.iconLeft]: iconLeft,
        [classes.iconRight]: iconRight,
        [classes.adornmentLeft]: adornmentLeft,
        [classes.adornmentRight]: adornmentRight,
        [classes.underline]: underline,
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
        to={to}
        data-active={active}
        {...rest}
      >
        {children}
      </BaseButton>
    );
  }
}

const enhanced = withForwardRef(withStyles(styles)(Button));
export type ButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
