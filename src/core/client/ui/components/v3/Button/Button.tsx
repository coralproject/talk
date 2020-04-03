import cn from "classnames";
import { pick } from "lodash";
import React from "react";

import { BaseButton } from "coral-ui/components/v2";
import { BaseButtonProps } from "coral-ui/components/v2/BaseButton";
import { withStyles } from "coral-ui/hocs";
import { Omit } from "coral-ui/types";

import styles from "./Button.css";

interface Props extends Omit<BaseButtonProps, "ref"> {
  anchor?: boolean;
  href?: string;
  target?: string;
  to?: string;

  classes: typeof styles & BaseButtonProps["classes"];
  className?: string;

  textSize?: "medium" | "none";
  marginSize?: "medium" | "none";
  color?: "streamBlue" | "mono" | "none";
  variant?: "filled" | "outlined" | "text" | "none";

  upperCase?: boolean;
  disabled?: boolean;
}

export class Button extends React.Component<Props> {
  public render() {
    const {
      classes,
      className,
      variant = "filled",
      color = "streamBlue",
      textSize = "medium",
      marginSize = "medium",
      children,
      disabled = false,
      to,
      upperCase = false,
      ...rest
    } = this.props;

    const rootClassName = cn(
      classes.root,
      classes.base,
      {
        [classes.filled]: variant === "filled",
        [classes.outlined]: variant === "outlined",
        [classes.text]: variant === "text",
        [classes.textSizeMedium]: textSize === "medium",
        [classes.marginSizeMedium]: marginSize === "medium",
        [classes.colorStreamBlue]: color === "streamBlue",
        [classes.colorMono]: color === "mono",
        [classes.disabled]: disabled,
        [classes.upperCase]: upperCase,
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
