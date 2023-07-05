import { Localized } from "@fluent/react/compat";
import cn from "classnames";

import React, { FunctionComponent, HTMLAttributes, useCallback } from "react";

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

interface Props extends HTMLAttributes<any> {
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
  /**
   * The container used for the root node.
   * Either a string to use a DOM element, a component, or an element.
   */
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
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
  container,
  "aria-live": ariaLive,
  role,
  ...rest
}) => {
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
  if (!visible) {
    return null;
  }

  const content = (
    <div className={classes.container}>
      {iconPosition === "left" && icon !== null && (
        <div className={iconClasses}>{icon}</div>
      )}
      <div className={classes.content} role={role} aria-live={ariaLive}>
        {title !== null && <div className={titleClasses}>{title}</div>}
        <div className={classes.body}>{children}</div>
      </div>
      {onClose && (
        <div className={classes.actions}>
          <Localized id="ui-callout-closeButton" attrs={{ "aria-label": true }}>
            <BaseButton
              onClick={onCloseClicked}
              data-testid="callout-close-button"
              aria-label="Close"
            >
              <Icon size="sm">close</Icon>
            </BaseButton>
          </Localized>
        </div>
      )}
    </div>
  );

  const innerProps = {
    className: rootClasses,
    ...rest,
  };
  const Container = container!;
  if (React.isValidElement<any>(Container)) {
    return React.cloneElement(Container, { ...innerProps, content });
  } else {
    return <Container {...innerProps}>{content}</Container>;
  }
};

CallOut.defaultProps = {
  container: "div",
};

const enhanced = withStyles(styles)(CallOut);

export default enhanced;
