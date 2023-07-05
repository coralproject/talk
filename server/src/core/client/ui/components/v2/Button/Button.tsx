import cn from "classnames";
import { pick } from "lodash";
import React, { FunctionComponent, Ref } from "react";

import { withForwardRef } from "coral-ui/hocs";
import useStyles from "coral-ui/hooks/useStyles";
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
   */
  classes?: Partial<
    typeof styles & { keyboardFocus: string; mouesHover: string }
  >;

  /** Size of the button */
  size?: "small" | "regular" | "large";

  /** Color of the button */
  color?: "regular" | "alert" | "mono" | "alt" | "dark" | "stream";

  /** Variant of the button */
  variant?:
    | "regular"
    | "flat"
    | "outlined"
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

export const Button: FunctionComponent<Props> = ({
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
}) => {
  const css = useStyles(styles, classes);
  const rootClassName = cn(
    css.root,
    {
      [css.sizeSmall]: size === "small",
      [css.sizeRegular]: size === "regular",
      [css.sizeLarge]: size === "large",
      [css.colorRegular]: color === "regular",
      [css.colorAlert]: color === "alert",
      [css.colorAlt]: color === "alt",
      [css.colorMono]: color === "mono",
      [css.colorDark]: color === "dark",
      [css.colorStream]: color === "stream",
      [css.variantRegular]: variant === "regular",
      [css.variantFlat]: variant === "flat",
      [css.variantOutline]: variant === "outlined",
      [css.variantText]: variant === "text",
      [css.variantUnderlined]: variant === "underlined",
      [css.variantTextUnderlined]: variant === "textUnderlined",
      [css.uppercase]: uppercase,
      [css.fullWidth]: fullWidth,
      [css.active]: active,
      [css.disabled]: disabled,
      [css.iconLeft]: iconLeft,
      [css.iconRight]: iconRight,
      [css.adornmentLeft]: adornmentLeft,
      [css.adornmentRight]: adornmentRight,
      [css.underline]: underline,
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
      to={to}
      data-active={active}
      aria-pressed={active}
      {...rest}
    >
      {children}
    </BaseButton>
  );
};

Button.defaultProps = {
  size: "regular",
  variant: "regular",
  color: "regular",
  uppercase: true,
};

const enhanced = withForwardRef(Button);
export type ButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
