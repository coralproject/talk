import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Omit } from "coral-framework/types";
import { withStyles } from "coral-ui/hocs";

import BaseButton, { BaseButtonProps } from "../BaseButton";
import Icon from "../Icon";

import { Flex } from "..";
import styles from "./Button.css";

interface Props extends Omit<BaseButtonProps, "ref"> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
  classes: typeof styles;
  /**
   * blankAdornment if true will leave some blank space after the text, so
   * that it looks nice, if mixed with other buttons which have an external link
   * icon as adornment.
   */
  blankAdornment?: boolean;
}

const Button: FunctionComponent<Props> = ({
  blankAdornment,
  className,
  href,
  onClick,
  children,
  classes,
  icon,
  disabled,
  ...rest
}) => {
  return (
    <BaseButton
      classes={{
        root: cn(classes.root, className, {
          [classes.blankAdornment]: blankAdornment,
        }),
        mouseHover: cn({ [classes.mouseHover]: !disabled }),
      }}
      href={href}
      onClick={onClick}
      anchor={Boolean(href)}
      disabled={disabled}
      {...rest}
    >
      <Flex>
        {icon && <div className={classes.iconBefore}>{icon}</div>}
        <div
          className={cn({
            [classes.anchor]: Boolean(href),
          })}
        >
          {children}
        </div>
      </Flex>
      {rest.target === "_blank" && (
        <Icon className={classes.iconAfter}>open_in_new</Icon>
      )}
    </BaseButton>
  );
};

export default withStyles(styles)(Button);
