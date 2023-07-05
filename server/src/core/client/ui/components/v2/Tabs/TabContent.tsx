import cn from "classnames";
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
  children?: React.ReactNode;
}

const TabContent: FunctionComponent<TabContentProps> = (props) => {
  const { children, activeTab, className } = props;
  return (
    <>
      {React.Children.toArray(children)
        .filter(
          (child: React.ReactElement<any>) => child.props.tabID === activeTab
        )
        .map((child: React.ReactElement<any>, i) =>
          React.cloneElement(child, {
            tabID: child.props.tabID ? child.props.tabID : i,
            className: cn(className, child.props.className),
          })
        )}
    </>
  );
};

export default TabContent;
