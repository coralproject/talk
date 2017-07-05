import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './TabContent.css';

function getRootClassName(className) {
  return cn('talk-tab-content', className, styles.root);
}

const TabContent = ({children, className, activeTab, sub, ...rest}) => (
  <div
    {...rest}
    className={getRootClassName(className)}
  >
    {
      React.Children.toArray(children)
        .filter((child) => child.props.tabId === activeTab)
        .map((child, i) =>
          React.cloneElement(child, {
            tabId: (child.props.tabId !== undefined) ? child.props.tabId : i,
            sub,
          }))
    }
  </div>
);

TabContent.propTypes = {
  className: PropTypes.string,
  activeTab: PropTypes.string,
  sub: PropTypes.bool,
};

export default TabContent;
