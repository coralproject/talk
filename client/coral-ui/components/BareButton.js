import React from 'react';
import PropTypes from 'prop-types';
import styles from './BareButton.css';
import cn from 'classnames';

/**
 *  BareButton is a button whose styling is stripped off to a minimum.
 *  Can pass anchor=true to use `a` instead of `button`
 */
export default class BareButton extends React.Component {
  ref = null;

  handleRef = ref => (this.ref = ref);
  focus = () => this.ref.focus();

  render() {
    const { anchor, className, ...props } = this.props;
    const Element = anchor ? 'a' : 'button';
    return (
      <Element
        {...props}
        className={cn(styles.bare, className)}
        ref={this.handleRef}
      />
    );
  }
}

BareButton.propTypes = {
  className: PropTypes.string,
  anchor: PropTypes.bool,
};
