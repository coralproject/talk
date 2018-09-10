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
  /**
   * The id/name of the tab
   */
  tabId: string;
  /**
   * Active status
   */
  active: boolean;
  /**
   * Color style variant
   */
  color: "primary" | "secondary";
  /**
   * Action taken on tab click
   */
  onTabClick?: (tabId: string) => void;
}

class TabBar extends React.Component<TabBarProps> {
  public handleTabClick = () => {
    if (this.props.onTabClick) {
      this.props.onTabClick(this.props.tabId);
    }
  };

  public render() {
    const { className, classes, children, tabId, active, color } = this.props;

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
        onClick={this.handleTabClick}
        aria-controls={tabId}
        aria-selected={active}
      >
        {children}
      </li>
    );
  }
}

const enhanced = withStyles(styles)(TabBar);
export default enhanced;
