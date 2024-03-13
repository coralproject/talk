import cn from "classnames";
import React, { FunctionComponent, Ref } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./TabBar.css";

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
  variant?:
    | "primary"
    | "secondary"
    | "default"
    | "streamSecondary"
    | "streamPrimary";
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
  onTabClick?: (tabID: string) => void;
  children?: React.ReactNode;

  forwardRef?: Ref<HTMLUListElement>;
}

const TabBar: FunctionComponent<TabBarProps> = (props) => {
  const {
    className,
    classes,
    children,
    onTabClick,
    activeTab,
    variant,
    defaultActiveTab,
    forwardRef,
  } = props;

  const rootClassName = cn(
    classes.root,
    [
      {
        [classes.primary]: variant === "primary",
        [classes.secondary]: variant === "secondary",
        [classes.streamSecondary]: variant === "streamSecondary",
        [classes.streamPrimary]: variant === "streamPrimary",
        [classes.default]: variant === "default",
      },
    ],
    className
  );

  const tabs = React.Children.toArray(children).map(
    (child: React.ReactElement<any>, index: number) =>
      React.cloneElement(child, {
        tabID: child.props.tabID ? child.props.tabID : index,
        active:
          defaultActiveTab && !activeTab
            ? child.props.tabID === defaultActiveTab
            : child.props.tabID === activeTab,
        variant: child.props.variant,
        float: child.props.float,
        onTabClick,
      })
  );

  return (
    <ul className={rootClassName} role="tablist" ref={forwardRef}>
      {tabs}
    </ul>
  );
};

TabBar.defaultProps = {
  variant: "default",
};

const enhanced = withStyles(styles)(TabBar);
export default enhanced;
