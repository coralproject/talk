import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import BaseButton, { BaseButtonProps } from "coral-ui/components/v2/BaseButton";
import Icon from "coral-ui/components/v2/Icon";

import { Flex } from "coral-ui/components/v2";
import styles from "./Button.css";

interface Props extends Omit<BaseButtonProps, "ref"> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
  classes: typeof styles;
  /**
   * adornment if set is rendered at the end of the button.
   */
  adornment?: React.ReactNode;
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
  adornment,
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
      <Flex alignItems="center">
        {icon && <div className={classes.iconBefore}>{icon}</div>}
        <div
          className={cn({
            [classes.anchor]: Boolean(href),
          })}
        >
          {children}
        </div>
      </Flex>
      {adornment && <div className={classes.iconAfter}>{adornment}</div>}
      {!adornment && rest.target === "_blank" && (
        <div className={classes.iconAfter}>
          <Icon className={classes.iconOpenInNew}>open_in_new</Icon>
        </div>
      )}
    </BaseButton>
  );
};

export default withStyles(styles)(Button);
