import React, { StatelessComponent } from "react";

export interface TabContentProps {
  /**
   * Active tab id/name
   */
  activeTab?: string;
}

const TabContent: StatelessComponent<TabContentProps> = props => {
  const { children, activeTab } = props;
  return (
    <>
      {React.Children.toArray(children)
        .filter(
          (child: React.ReactElement<any>) => child.props.tabId === activeTab
        )
        .map((child: React.ReactElement<any>, i) =>
          React.cloneElement(child, {
            tabId: child.props.tabId ? child.props.tabId : i,
          })
        )}
    </>
  );
};

export default TabContent;
