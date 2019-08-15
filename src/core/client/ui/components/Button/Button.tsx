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
  size?: "small" | "regular" | "large";

  /** Color of the button */
  color?:
    | "regular"
    | "primary"
    | "error"
    | "success"
    | "brand"
    | "light"
    | "dark";

  /** Variant of the button */
  variant?:
    | "regular"
    | "filled"
    | "outlined"
    | "ghost"
    | "underlined"
    | "adornment";

  /** If set renders a full width button */
  fullWidth?: boolean;

  /** If set renders active state e.g. to implement toggle buttons */
  active?: boolean;

  type?: "submit" | "reset" | "button";

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
}

export class Button extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    size: "regular",
    variant: "regular",
    color: "regular",
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
      ...rest
    } = this.props;

    const rootClassName = cn(
      classes.root,
      {
        [classes.sizeRegular]: size === "regular",
        [classes.sizeSmall]: size === "small",
        [classes.sizeLarge]: size === "large",
        [classes.colorRegular]: color === "regular",
        [classes.colorLight]: color === "light",
        [classes.colorPrimary]: color === "primary",
        [classes.colorError]: color === "error",
        [classes.colorSuccess]: color === "success",
        [classes.colorBrand]: color === "brand",
        [classes.colorDark]: color === "dark",
        [classes.variantRegular]: variant === "regular",
        [classes.variantFilled]: variant === "filled",
        [classes.variantOutlined]: variant === "outlined",
        [classes.variantGhost]: variant === "ghost",
        [classes.variantAdornment]: variant === "adornment",
        [classes.variantUnderlined]: variant === "underlined",
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
        {...rest}
      />
    );
  }
}

const enhanced = withForwardRef(withStyles(styles)(Button));
export type ButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
