import cn from "classnames";
import React from "react";
import { withStyles } from "talk-ui/hocs";
import * as styles from "./Tab.css";

export interface TabProps {
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
  active?: boolean;
  /**
   * Style variant
   */
  variant?: "primary" | "secondary";
  /**
   * Action taken on tab click
   */
  onTabClick?: (tabId: string) => void;
}

class Tab extends React.Component<TabProps> {
  public handleTabClick = () => {
    if (this.props.onTabClick) {
      this.props.onTabClick(this.props.tabId);
    }
  };

  public render() {
    const { className, classes, children, tabId, active, variant } = this.props;

    const rootClassName = cn(
      classes.root,
      {
        [classes.primary]: variant === "primary",
        [classes.secondary]: variant === "secondary",
        [classes.active]: active,
      },
      className
    );

    return (
      <li
        className={rootClassName}
        key={`${tabId}-tab`}
        id={`${tabId}-tab`}
        role="presentation"
        onClick={this.handleTabClick}
      >
        <button
          aria-controls={tabId}
          role="tab"
          aria-selected={active}
          onClick={this.handleTabClick}
        >
          {children}
        </button>
      </li>
    );
  }
}

const enhanced = withStyles(styles)(Tab);
export default enhanced;
