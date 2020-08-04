import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { BaseButton, Icon } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";

import styles from "./CallOut.css";

type CallOutColor =
  | "mono"
  | "success"
  | "error"
  | "primary"
  | "warning"
  | "none";

type IconColor = "inherit" | "none";

interface Props {
  children?: any;
  color?: CallOutColor;
  borderPosition?: "leftSide" | "top";
  icon?: any;
  iconPosition?: "left";
  iconColor?: IconColor;
  title?: any;
  titleWeight?: "bold" | "semiBold" | "none";

  className?: string;
  classes: typeof styles;
  visible?: boolean;
  onClose?: () => void;
}

const CallOut: FunctionComponent<Props> = ({
  color = "mono",
  borderPosition = "leftSide",
  icon = null,
  iconPosition = "left",
  iconColor = "inherit",
  title = null,
  titleWeight = "bold",
  classes,
  className,
  children,
  visible = true,
  onClose,
}) => {
  if (!visible) {
    return null;
  }

  const rootClasses = cn(
    classes.root,
    {
      [classes.mono]: color === "mono",
      [classes.success]: color === "success",
      [classes.error]: color === "error",
      [classes.primary]: color === "primary",
      [classes.warning]: color === "warning",
      [classes.leftBorder]: borderPosition === "leftSide",
      [classes.topBorder]: borderPosition === "top",
    },
    className
  );

  const iconClasses = cn(classes.icon, {
    [classes.mono]: color === "mono" && iconColor === "inherit",
    [classes.success]: color === "success" && iconColor === "inherit",
    [classes.error]: color === "error" && iconColor === "inherit",
    [classes.primary]: color === "primary" && iconColor === "inherit",
    [classes.warning]: color === "warning" && iconColor === "inherit",
    [classes.leftIcon]: iconPosition === "left",
  });

  const titleClasses = cn(classes.title, {
    [classes.titleMargin]: children !== null && children !== undefined,
    [classes.titleBold]: titleWeight === "bold",
    [classes.titleSemiBold]: titleWeight === "semiBold",
  });

  const onCloseClicked = useCallback(() => {
    if (!onClose) {
      return;
    }

    onClose();
  }, [onClose]);

  return (
    <div className={rootClasses}>
      <div className={classes.container}>
        {iconPosition === "left" && icon !== null && (
          <div className={iconClasses}>{icon}</div>
        )}
        <div className={classes.content}>
          {title !== null && <div className={titleClasses}>{title}</div>}
          <div className={classes.body}>{children}</div>
        </div>
        {onClose && (
          <div className={classes.actions}>
            <BaseButton
              onClick={onCloseClicked}
              data-testid="callout-close-button"
            >
              <Icon size="sm">close</Icon>
            </BaseButton>
          </div>
        )}
      </div>
    </div>
  );
};

const enhanced = withStyles(styles)(CallOut);

export default enhanced;
