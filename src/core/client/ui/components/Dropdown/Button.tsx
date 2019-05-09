import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Omit } from "talk-framework/types";
import { withStyles } from "talk-ui/hocs";

import BaseButton, { BaseButtonProps } from "../BaseButton";
import Icon from "../Icon";

import styles from "./Button.css";

interface Props extends Omit<BaseButtonProps, "ref"> {
  children: React.ReactNode;
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
  ...rest
}) => {
  return (
    <BaseButton
      classes={{
        root: cn(classes.root, className, {
          [classes.blankAdornment]: blankAdornment,
        }),
        mouseHover: classes.mouseHover,
      }}
      href={href}
      onClick={onClick}
      anchor={Boolean(href)}
      {...rest}
    >
      {children}
      {rest.target === "_blank" && (
        <Icon className={classes.icon}>open_in_new</Icon>
      )}
    </BaseButton>
  );
};

export default withStyles(styles)(Button);
