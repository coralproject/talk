import React, { FunctionComponent } from "react";

export interface TabBarProps {
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Name of the tab
   */
  tabId: string;
}

const TabPane: FunctionComponent<TabBarProps> = props => {
  const { className, children, tabId, ...rest } = props;
  return (
    <section
      {...rest}
      className={className}
      key={tabId}
      id={`tabPane-${tabId}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
    >
      {children}
    </section>
  );
};

export default TabPane;
