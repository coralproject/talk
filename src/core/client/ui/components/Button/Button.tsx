import cn from "classnames";
import { pick } from "lodash";
import React, { Ref } from "react";

import { withForwardRef, withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import BaseButton, { BaseButtonProps } from "../BaseButton";

import styles from "./Button.css";

// This should extend from BaseButton instead but we can't because of this bug
// TODO: add bug link.
interface InnerProps extends BaseButtonProps {
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
  color?: "regular" | "primary" | "error" | "success";

  /** Variant of the button */
  variant?: "regular" | "filled" | "outlined" | "ghost" | "underlined";

  /** If set renders a full width button */
  fullWidth?: boolean;

  /** If set renders active state e.g. to implement toggle buttons */
  active?: boolean;

  type?: "submit" | "reset" | "button";

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
      [classes.variantUnderlined]: variant === "underlined",
      [classes.fullWidth]: fullWidth,
      [classes.active]: active,
      [classes.disabled]: disabled,
    });

    return (
      <BaseButton
        className={rootClassName}
        classes={pick(classes, "keyboardFocus", "mouseHover")}
        disabled={disabled}
        forwardRef={forwardRef}
        type={type}
        {...rest}
      />
    );
  }
}

const enhanced = withForwardRef(withStyles(styles)(Button));
export type ButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
