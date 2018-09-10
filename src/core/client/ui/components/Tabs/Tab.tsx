import cn from "classnames";
import React, { StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";
import * as styles from "./Tab.css";

export interface TabBarProps {
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;

  tabId: string;
  active: boolean;
  color: string;
  onTabClick?: () => void;
}

const TabBar: StatelessComponent<TabBarProps> = props => {
  const {
    className,
    classes,
    children,
    tabId,
    active,
    color,
    onTabClick,
  } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.primary]: color === "primary",
      [classes.secondary]: color === "secondary",
      [classes.active]: active,
    },
    className
  );

  return (
    <li
      className={rootClassName}
      key={tabId}
      id={`${tabId}-tab`}
      role="tab"
      onClick={onTabClick}
      aria-controls={tabId}
      aria-selected={active}
    >
      {children}
    </li>
  );
};

const enhanced = withStyles(styles)(TabBar);
export default enhanced;
