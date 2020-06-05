import cn from "classnames";
import React from "react";

import { withStyles } from "coral-ui/hocs";

import BaseButton from "coral-ui/components/v2/BaseButton";

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
  tabID: string;
  /**
   * Active status
   */
  active?: boolean;
  /**
   * Style variant
   */
  variant?: "primary" | "secondary" | "default" | "streamSecondary";
  /**
   * Action taken on tab click
   */
  onTabClick?: (tabID: string) => void;

  uppercase?: boolean;
}

class Tab extends React.Component<TabProps> {
  public handleTabClick = () => {
    if (this.props.onTabClick) {
      this.props.onTabClick(this.props.tabID);
    }
  };

  public render() {
    const {
      className,
      classes,
      children,
      tabID,
      active,
      variant,
      uppercase,
    } = this.props;

    const buttonClassName = cn(
      classes.button,
      {
        [classes.primary]: variant === "primary",
        [classes.secondary]: variant === "secondary",
        [classes.streamSecondary]: variant === "streamSecondary",
        [classes.default]: variant === "default",
        [classes.uppercase]: uppercase,
        [classes.active]: active,
      },
      className
    );

    return (
      <li
        className={classes.root}
        key={tabID}
        id={`tab-${tabID}`}
        role="presentation"
      >
        <BaseButton
          className={buttonClassName}
          aria-controls={`tabPane-${tabID}`}
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
