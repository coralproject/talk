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

  color: "primary" | "secondary";

  activeTab?: string;
  defaultActiveId?: string;

  onChange?: (activeId: string) => void;
  onTabClick?: (tabId: string) => void;
}

const TabBar: StatelessComponent<TabBarProps> = props => {
  const {
    className,
    classes,
    children,
    onTabClick,
    activeTab,
    color,
    defaultActiveId,
  } = props;

  const rootClassName = cn(
    classes.root,
    [
      {
        [classes.primary]: color === "primary",
        [classes.secondary]: color === "secondary",
      },
    ],
    className
  );

  const tabs = React.Children.toArray(children).map(
    (child: React.ReactElement<any>, index: number) =>
      React.cloneElement(child, {
        index,
        active:
          defaultActiveId && !activeTab
            ? child.props.tabId === defaultActiveId
            : child.props.tabId === activeTab,
        color,
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
  color: "primary",
};

const enhanced = withStyles(styles)(TabBar);
export default enhanced;
