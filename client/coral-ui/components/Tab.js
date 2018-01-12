import React from 'react';
import styles from './Tab.css';
import cn from 'classnames';
import PropTypes from 'prop-types';

/**
 * The `Tab` component is used inside the `TabBar` Component, to
 * render tabs.
 */
class Tab extends React.Component {
  handleTabClick = () => {
    if (this.props.onTabClick) {
      this.props.onTabClick(this.props.tabId);
    }
  };

  getRootClassName({ active, className, sub, classNames = {} } = this.props) {
    return cn(
      'talk-tab',
      {
        [classNames.root || styles.root]: !sub,
        [classNames.rootSub || styles.rootSub]: sub,
        [classNames.rootActive || styles.rootActive]: active && !sub,
        [classNames.rootSubActive || styles.rootSubActive]: active && sub,
        'talk-tab-active': active,
      },
      className
    );
  }

  getButtonClassName({ sub, active, classNames = {} } = this.props) {
    return cn('talk-tab-button', {
      [classNames.button || styles.button]: !sub,
      [classNames.buttonSub || styles.buttonSub]: sub,
      [classNames.buttonActive || styles.buttonActive]: active && !sub,
      [classNames.buttonSubActive || styles.buttonSubActive]: active && sub,
    });
  }

  render() {
    const {
      children,
      classNames: _a,
      active,
      onTabClick: _c,
      tabId: _d,
      sub: _e,
      'aria-controls': ariaControls,
      ...rest
    } = this.props;

    return (
      <li {...rest} role="presentation" className={this.getRootClassName()}>
        <button
          aria-controls={ariaControls}
          role="tab"
          aria-selected={active}
          className={this.getButtonClassName()}
          onClick={this.handleTabClick}
        >
          {children}
        </button>
      </li>
    );
  }
}

Tab.propTypes = {
  // className to be added to the root element.
  className: PropTypes.string,

  // classNames allows full design customization of the component.
  classNames: PropTypes.shape({
    root: PropTypes.string,
    rootActive: PropTypes.string,
    rootSub: PropTypes.string,
    rootSubActive: PropTypes.string,
    button: PropTypes.string,
    buttonActive: PropTypes.string,
    buttonSub: PropTypes.string,
    buttonSubActive: PropTypes.string,
  }),

  // active indicates that this tab is currently active.
  // This is injected by the `TabBar` component.
  active: PropTypes.bool,

  // onTabClick is fired whenever the tab was clicked. The tabId is passed as
  // the first argument.
  onTabClick: PropTypes.func,

  // Sub indicates that this is a tab of a sub-tab-panel.
  // This is injected by the `TabBar` component.
  sub: PropTypes.bool,

  // `aria-controls` should be set to the `id` of the `TabContent` for accessibility.
  // This is injected by the `TabBar` component.
  'aria-controls': PropTypes.string,
};

export default Tab;
