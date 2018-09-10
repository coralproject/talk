import cn from "classnames";
import React, { StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";
import * as styles from "./TabPane.css";

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
  hidden: boolean;
}

const TabContent: StatelessComponent<TabBarProps> = props => {
  const { className, classes, children, tabId, hidden } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <section
      className={rootClassName}
      key={tabId}
      id={tabId}
      role="tabpanel"
      aria-labelledby="foo-tab"
      hidden={hidden}
    >
      {children}
    </section>
  );
};

const enhanced = withStyles(styles)(TabContent);
export default enhanced;
