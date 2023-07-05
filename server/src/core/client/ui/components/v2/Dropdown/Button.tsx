import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";
import BaseButton, { BaseButtonProps } from "coral-ui/components/v2/BaseButton";
import Icon from "coral-ui/components/v2/Icon";
import useStyles from "coral-ui/hooks/useStyles";

import styles from "./Button.css";

interface Props extends Omit<BaseButtonProps, "ref"> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  to?: string;
  className?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
  classes?: Partial<typeof styles>;
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
  const css = useStyles(styles, classes);
  return (
    <BaseButton
      classes={{
        root: cn(css.root, className, {
          [css.blankAdornment]: blankAdornment,
        }),
        mouseHover: cn({ [css.mouseHover]: !disabled }),
      }}
      href={href}
      onClick={onClick}
      anchor={Boolean(href)}
      disabled={disabled}
      {...rest}
    >
      <Flex alignItems="center">
        {icon && <div className={css.iconBefore}>{icon}</div>}
        <div
          className={cn({
            [css.anchor]: Boolean(href),
          })}
        >
          {children}
        </div>
      </Flex>
      {adornment && <div className={css.iconAfter}>{adornment}</div>}
      {!adornment && rest.target === "_blank" && (
        <div className={css.iconAfter}>
          <Icon className={css.iconOpenInNew}>open_in_new</Icon>
        </div>
      )}
    </BaseButton>
  );
};

export default Button;
