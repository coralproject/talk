import React, { FunctionComponent } from "react";

export interface TabBarProps {
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Name of the tab
   */
  tabID: string;
}

const TabPane: FunctionComponent<TabBarProps> = (props) => {
  const { className, children, tabID, ...rest } = props;
  return (
    <section
      {...rest}
      className={className}
      key={tabID}
      id={`tabPane-${tabID}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabID}`}
    >
      {children}
    </section>
  );
};

export default TabPane;
