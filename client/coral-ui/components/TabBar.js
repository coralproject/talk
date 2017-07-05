import React from 'react';
import styles from './TabBar.css';
import cn from 'classnames';
import Tab from './Tab';
import PropTypes from 'prop-types';

class TabBar extends React.Component {

  getRootClassName({className, classNames = {}, sub} = this.props) {
    return cn(
      'talk-tab-bar',
      className,
      {
        [classNames.root || styles.root]: !sub,
        [classNames.rootSub || styles.rootSub]: sub,
      }
    );
  }

  render() {
    const {
      children,
      activeTab,
      tabClassNames,
      classNames: _a,
      onTabClick: _b,
      'aria-controls': ariaControls,
      sub,
      ...rest,
    } = this.props;

    return (
      <ul
        {...rest}
        role="tablist"
        className={this.getRootClassName()}
      >
        {React.Children.toArray(children)
          .map((child, i) =>
            React.cloneElement(child, {
              tabId: (child.props.tabId !== undefined) ? child.props.tabId : i,
              active: child.props.tabId === activeTab,
              onTabClick: this.props.onTabClick,
              classNames: tabClassNames,
              'aria-controls': ariaControls,
              sub,
            })
          )}
      </ul>
    );
  }
}

TabBar.propTypes = {
  className: PropTypes.string,
  classNames: PropTypes.shape({
    root: PropTypes.string,
    rootSub: PropTypes.string,
  }),
  tabClassNames: Tab.propTypes.classNames,
  activeTab: PropTypes.string,
  onTabClick: PropTypes.func,
  sub: PropTypes.bool,
};

export default TabBar;
