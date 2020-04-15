import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { BaseButton, Flex, Icon } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";

import styles from "./CallOut.css";

type CallOutColor =
  | "mono"
  | "positive"
  | "negative"
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
      [classes.positive]: color === "positive",
      [classes.negative]: color === "negative",
      [classes.primary]: color === "primary",
      [classes.warning]: color === "warning",
      [classes.leftBorder]: borderPosition === "leftSide",
      [classes.topBorder]: borderPosition === "top",
    },
    className
  );

  const iconClasses = cn(classes.icon, {
    [classes.mono]: color === "mono" && iconColor === "inherit",
    [classes.positive]: color === "positive" && iconColor === "inherit",
    [classes.negative]: color === "negative" && iconColor === "inherit",
    [classes.primary]: color === "primary" && iconColor === "inherit",
    [classes.warning]: color === "warning" && iconColor === "inherit",
    [classes.leftIcon]: iconPosition === "left",
  });

  const titleClasses = cn(classes.title, {
    [classes.titleMargin]: children !== null && children !== undefined,
  });

  const onCloseClicked = useCallback(() => {
    if (!onClose) {
      return;
    }

    onClose();
  }, [onClose]);

  return (
    <div className={rootClasses}>
      <Flex justifyContent="flex-start">
        {iconPosition === "left" && icon !== null && (
          <div className={iconClasses}>{icon}</div>
        )}
        <div className={classes.content}>
          {title !== null && <div className={titleClasses}>{title}</div>}
          <div className={classes.body}>{children}</div>
        </div>
        {onClose && (
          <BaseButton className={classes.closeButton} onClick={onCloseClicked}>
            <Icon size="sm">close</Icon>
          </BaseButton>
        )}
      </Flex>
    </div>
  );
};

const enhanced = withStyles(styles)(CallOut);

export default enhanced;
