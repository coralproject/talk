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

  "aria-labelledBy"?: string;

  children?: React.ReactNode;
}

const TabPane: FunctionComponent<TabBarProps> = (props) => {
  const {
    className,
    children,
    tabID,
    "aria-labelledBy": ariaLabelledBy,
    ...rest
  } = props;
  return (
    <section
      {...rest}
      className={className}
      key={tabID}
      id={`tabPane-${tabID}`}
      aria-labelledby={ariaLabelledBy || `tab-${tabID}`}
    >
      {children}
    </section>
  );
};

export default TabPane;
