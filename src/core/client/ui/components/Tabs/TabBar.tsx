import cn from "classnames";
import React, { StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";
import * as styles from "./TabBar.css";

export interface TabBarProps {
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  /**
   * Style variant
   */
  variant?: "primary" | "secondary";
  /**
   * Active tab id/name
   */
  activeTab?: string;
  /**
   * Default active tab id/name
   */
  defaultActiveTab?: string;
  /**
   * Action taken on tab click
   */
  onTabClick?: (tabId: string) => void;
}

const TabBar: StatelessComponent<TabBarProps> = props => {
  const {
    className,
    classes,
    children,
    onTabClick,
    activeTab,
    variant,
    defaultActiveTab,
  } = props;

  const rootClassName = cn(
    classes.root,
    [
      {
        [classes.primary]: variant === "primary",
        [classes.secondary]: variant === "secondary",
      },
    ],
    className
  );

  const tabs = React.Children.toArray(children).map(
    (child: React.ReactElement<any>, index: number) =>
      React.cloneElement(child, {
        tabId: child.props.tabId ? child.props.tabId : index,
        active:
          defaultActiveTab && !activeTab
            ? child.props.tabId === defaultActiveTab
            : child.props.tabId === activeTab,
        variant,
        onTabClick,
      })
  );

  return (
    <ul className={rootClassName} role="tablist">
      {tabs}
    </ul>
  );
};

TabBar.defaultProps = {
  variant: "primary",
};

const enhanced = withStyles(styles)(TabBar);
export default enhanced;
