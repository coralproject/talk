import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './TabContent.css';

function getRootClassName(className) {
  return cn('talk-tab-content', className, styles.root);
}

/**
 * The `TabContent` component accepts `TabPane` components to render
 * the content of a `Tab`.
 */
const TabContent = ({ children, className, activeTab, sub, ...rest }) => (
  <div {...rest} className={getRootClassName(className)}>
    {React.Children.toArray(children)
      .filter(child => child.props.tabId === activeTab)
      .map((child, i) =>
        React.cloneElement(child, {
          tabId: child.props.tabId !== undefined ? child.props.tabId : i,
          sub,
        })
      )}
  </div>
);

TabContent.propTypes = {
  // className to be added to the root element.
  className: PropTypes.string,

  // activeTab should be set to the currently active tabId.
  activeTab: PropTypes.string,

  // Sub indicates that this component belongs to a sub-tab-panel.
  sub: PropTypes.bool,
};

export default TabContent;
