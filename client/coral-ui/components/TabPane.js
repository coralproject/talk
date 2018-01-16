import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

function getRootClassName(className) {
  return cn('talk-pane', className);
}

/**
 * The `TabPane` component is used inside the `TabContent` component to render
 * the content of a `Tab`.
 */
const TabPane = ({ children, className, tabId: _a, sub: _b, ...rest }) => (
  <div {...rest} className={getRootClassName(className)}>
    {children}
  </div>
);

TabPane.propTypes = {
  // className to be added to the root element.
  className: PropTypes.string,

  tabId: PropTypes.string,

  // Sub indicates that this component belongs to a sub-tab-panel.
  // This is injected by the `TabContent` component.
  sub: PropTypes.bool,
};

export default TabPane;
