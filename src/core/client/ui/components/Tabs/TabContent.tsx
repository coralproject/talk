import React, { FunctionComponent } from "react";

export interface TabContentProps {
  /**
   * Active tab id/name
   */
  activeTab?: string;
  /**
   * classNames
   */
  className?: string;
}

const TabContent: FunctionComponent<TabContentProps> = props => {
  const { children, activeTab, className } = props;
  return (
    <>
      {React.Children.toArray(children)
        .filter(
          (child: React.ReactElement<any>) => child.props.tabId === activeTab
        )
        .map((child: React.ReactElement<any>, i) =>
          React.cloneElement(child, {
            tabId: child.props.tabId ? child.props.tabId : i,
            className,
          })
        )}
    </>
  );
};

export default TabContent;
