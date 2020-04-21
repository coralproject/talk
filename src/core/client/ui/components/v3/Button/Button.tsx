import cn from "classnames";
import { pick } from "lodash";
import React from "react";

import { BaseButton } from "coral-ui/components/v2";
import { BaseButtonProps } from "coral-ui/components/v2/BaseButton";
import { withStyles } from "coral-ui/hocs";

import styles from "./Button.css";

interface Props extends Omit<BaseButtonProps, "ref"> {
  anchor?: boolean;
  href?: string;
  target?: string;
  to?: string;

  classes: typeof styles & BaseButtonProps["classes"];
  className?: string;

  textSize?: "extraSmall" | "small" | "medium" | "large" | "none";
  marginSize?: "extraSmall" | "small" | "medium" | "large" | "none";
  color?: "primary" | "secondary" | "positive" | "negative" | "none";
  variant?: "filled" | "outlined" | "flat" | "none";

  upperCase?: boolean;
  underline?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export class Button extends React.Component<Props> {
  public render() {
    const {
      classes,
      className,
      variant = "filled",
      color = "primary",
      textSize = "small",
      marginSize = "small",
      children,
      disabled = false,
      to,
      upperCase = false,
      underline = false,
      fullWidth = false,
      ...rest
    } = this.props;

    const rootClassName = cn(
      classes.root,
      classes.base,
      {
        [classes.filled]: variant === "filled",
        [classes.outlined]: variant === "outlined",
        [classes.flat]: variant === "flat",
        [classes.textSizeExtraSmall]: textSize === "extraSmall",
        [classes.textSizeSmall]: textSize === "small",
        [classes.textSizeMedium]: textSize === "medium",
        [classes.textSizeLarge]: textSize === "large",
        [classes.marginSizeExtraSmall]: marginSize === "extraSmall",
        [classes.marginSizeSmall]: marginSize === "small",
        [classes.marginSizeMedium]: marginSize === "medium",
        [classes.marginSizeLarge]: marginSize === "large",
        [classes.colorPrimary]: color === "primary",
        [classes.colorSecondary]: color === "secondary",
        [classes.colorPositive]: color === "positive",
        [classes.colorNegative]: color === "negative",
        [classes.disabled]: disabled,
        [classes.upperCase]: upperCase,
        [classes.underline]: underline,
        [classes.fullWidth]: fullWidth,
      },
      className
    );

    return (
      <BaseButton
        className={rootClassName}
        classes={pick(classes, "keyboardFocus", "mouseHover")}
        disabled={disabled}
        to={to}
        {...rest}
      >
        {children}
      </BaseButton>
    );
  }
}

const enhanced = withStyles(styles)(Button);

export default enhanced;
