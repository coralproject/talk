import cn from "classnames";
import { pick } from "lodash";
import React, { FunctionComponent, Ref } from "react";

import { BaseButton } from "coral-ui/components/v2";
import { BaseButtonProps } from "coral-ui/components/v2/BaseButton";
import { withForwardRef } from "coral-ui/hocs";
import useStyles from "coral-ui/hooks/useStyles";

import styles from "./Button.css";

interface Props extends Omit<BaseButtonProps, "ref"> {
  anchor?: boolean;
  href?: string;
  target?: string;
  to?: string;

  classes?: Partial<
    typeof styles & { keyboardFocus: string; mouesHover: string }
  >;
  className?: string;

  fontFamily?: "primary" | "secondary" | "none";
  fontWeight?: "regular" | "semiBold" | "bold" | "none";
  fontSize?: "extraSmall" | "small" | "medium" | "large" | "none";
  textAlign?: "left" | "center" | "right";
  paddingSize?: "extraSmall" | "small" | "medium" | "large" | "none";
  color?: "primary" | "secondary" | "success" | "error" | "none";
  variant?: "filled" | "outlined" | "flat" | "none";

  active?: boolean;
  upperCase?: boolean;
  underline?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
}

export const Button: FunctionComponent<Props> = ({
  classes,
  className,
  variant = "filled",
  color = "primary",
  textAlign = "center",
  fontSize = "small",
  fontFamily = "primary",
  fontWeight = "bold",
  paddingSize = "small",
  children,
  disabled = false,
  to,
  upperCase = false,
  underline = false,
  fullWidth = false,
  href,
  forwardRef,
  active,
  ...rest
}) => {
  const css = useStyles(styles, classes);
  const rootClassName = cn(
    css.base,
    {
      [css.filled]: variant === "filled",
      [css.outlined]: variant === "outlined",
      [css.flat]: variant === "flat",
      [css.active]: active,
      [css.fontSizeExtraSmall]: fontSize === "extraSmall",
      [css.fontSizeSmall]: fontSize === "small",
      [css.fontSizeMedium]: fontSize === "medium",
      [css.fontSizeLarge]: fontSize === "large",
      [css.textAlignLeft]: textAlign === "left",
      [css.textAlignCenter]: textAlign === "center",
      [css.textAlignRight]: textAlign === "right",
      [css.fontFamilyPrimary]: fontFamily === "primary",
      [css.fontFamilySecondary]: fontFamily === "secondary",
      [css.fontWeightPrimaryRegular]:
        fontFamily === "primary" && fontWeight === "regular",
      [css.fontWeightPrimarySemiBold]:
        fontFamily === "primary" && fontWeight === "semiBold",
      [css.fontWeightPrimaryBold]:
        fontFamily === "primary" && fontWeight === "bold",
      [css.fontWeightSecondaryRegular]:
        fontFamily === "secondary" && fontWeight === "regular",
      [css.fontWeightSecondarySemiBold]:
        fontFamily === "secondary" && fontWeight === "semiBold",
      [css.fontWeightSecondaryBold]:
        fontFamily === "secondary" && fontWeight === "bold",
      [css.paddingSizeExtraSmall]: paddingSize === "extraSmall",
      [css.paddingSizeSmall]: paddingSize === "small",
      [css.paddingSizeMedium]: paddingSize === "medium",
      [css.paddingSizeLarge]: paddingSize === "large",
      [css.colorPrimary]: color === "primary",
      [css.colorSecondary]: color === "secondary",
      [css.colorSuccess]: color === "success",
      [css.colorError]: color === "error",
      [css.disabled]: disabled,
      [css.upperCase]: upperCase,
      [css.underline]: underline,
      [css.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <BaseButton
      className={rootClassName}
      classes={pick(classes, "keyboardFocus", "mouseHover")}
      disabled={disabled}
      to={to}
      href={href}
      anchor={href ? true : false}
      ref={forwardRef}
      aria-pressed={active}
      data-variant={variant}
      {...rest}
    >
      {children}
    </BaseButton>
  );
};

const enhanced = withForwardRef(Button);

export default enhanced;
