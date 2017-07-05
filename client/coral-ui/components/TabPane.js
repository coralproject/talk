import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

function getRootClassName(className) {
  return cn('talk-pane', className);
}

const TabPane = ({children, className, tabId: _a, sub: _b, ...rest}) => (
  <div
    {...rest}
    className={getRootClassName(className)}
  >
    {children}
  </div>
);

TabPane.propTypes = {
  className: PropTypes.string,
  tabId: PropTypes.string,
  sub: PropTypes.bool,
};

export default TabPane;
