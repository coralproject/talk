import React from 'react';
import styles from './Tab.css';
import cn from 'classnames';
import PropTypes from 'prop-types';

class Tab extends React.Component {
  handleTabClick = () => {
    if (this.props.onTabClick) {
      this.props.onTabClick(this.props.tabId);
    }
  }

  getRootClassName({active, className, sub, classNames = {}} = this.props) {
    return cn(
      'talk-tab',
      className,
      {
        [classNames.root || styles.root]: !sub,
        [classNames.rootSub || styles.rootSub]: sub,
        [classNames.rootActive || styles.rootActive]: active && !sub,
        [classNames.rootSubActive || styles.rootSubActive]: active && sub,
        'talk-tab-active': active,
      }
    );
  }

  getButtonClassName({sub, active, classNames = {}} = this.props) {
    return cn(
      'talk-tab-button',
      {
        [classNames.button || styles.button]: !sub,
        [classNames.buttonSub || styles.buttonSub]: sub,
        [classNames.buttonActive || styles.buttonActive]: active && !sub,
        [classNames.buttonSubActive || styles.buttonSubActive]: active && sub,
      }
    );
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
      ...rest,
    } = this.props;

    return (
      <li
        {...rest}
        role="presentation"
        className={this.getRootClassName()}
      >
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
  className: PropTypes.string,
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
  active: PropTypes.bool,
  onTabClick: PropTypes.func,
  sub: PropTypes.bool,
};

export default Tab;
