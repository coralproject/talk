import cn from "classnames";
import React, { StatelessComponent } from "react";

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
  blankAdornment?: boolean;
}

const Button: StatelessComponent<Props> = ({
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
