import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./NavigationItem.css";

interface Props {
  children: React.ReactNode;
  href?: string;
  className?: string;
  active?: boolean;
  onClick?: React.EventHandler<React.MouseEvent>;
  classes: typeof styles;
}

const NavigationItem: FunctionComponent<Props> = ({
  children,
  href,
  className,
  active,
  onClick,
  classes,
  ...rest
}) => {
  return (
    <li {...rest} className={cn(className, classes.root)}>
      <a
        className={cn(className, classes.anchor, {
          [classes.active]: active,
        })}
        href={href}
        onClick={onClick}
      >
        {children}
      </a>
    </li>
  );
};

export default withStyles(styles)(NavigationItem);
