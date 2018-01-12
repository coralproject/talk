import React from 'react';
import styles from './TabBar.css';
import cn from 'classnames';
import Tab from './Tab';
import PropTypes from 'prop-types';

/**
 * The `TabBar` component accepts `Tab` components to create
 * a tab bar.
 */
class TabBar extends React.Component {
  getRootClassName({ className, classNames = {}, sub } = this.props) {
    return cn(
      'talk-tab-bar',
      {
        [classNames.root || styles.root]: !sub,
        [classNames.rootSub || styles.rootSub]: sub,
      },
      className
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
      ...rest
    } = this.props;

    return (
      <ul {...rest} role="tablist" className={this.getRootClassName()}>
        {React.Children.toArray(children).map((child, i) =>
          React.cloneElement(child, {
            tabId: child.props.tabId !== undefined ? child.props.tabId : i,
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
  // className to be added to the root element.
  className: PropTypes.string,

  // classNames allows full design customization of the component.
  classNames: PropTypes.shape({
    root: PropTypes.string,
    rootSub: PropTypes.string,
  }),

  // classNames to be passed to the children.
  tabClassNames: Tab.propTypes.classNames,

  // activeTab should be set to the currently active tabId.
  activeTab: PropTypes.string,

  // onTabClick is fired whenever the tab was clicked. The tabId is passed as
  // the first argument.
  onTabClick: PropTypes.func,

  // Sub indicates that this is a sub-tab-panel.
  sub: PropTypes.bool,

  // `aria-controls` should be set to the `id` of the `TabContent` for accessibility.
  'aria-controls': PropTypes.string,
};

export default TabBar;
