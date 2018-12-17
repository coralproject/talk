import cn from "classnames";
import React from "react";

import { withStyles } from "talk-ui/hocs";

import BaseButton from "../BaseButton";

import styles from "./Tab.css";

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

    const buttonClassName = cn(
      classes.button,
      {
        [classes.primary]: variant === "primary",
        [classes.secondary]: variant === "secondary",
        [classes.active]: active,
      },
      className
    );

    return (
      <li
        className={styles.root}
        key={tabId}
        id={`tab-${tabId}`}
        role="presentation"
      >
        <BaseButton
          className={buttonClassName}
          aria-controls={`tabPane-${tabId}`}
          role="tab"
          aria-selected={active}
          onClick={this.handleTabClick}
        >
          {children}
        </BaseButton>
      </li>
    );
  }
}

const enhanced = withStyles(styles)(Tab);
export default enhanced;
