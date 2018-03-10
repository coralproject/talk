import React from 'react';
import cn from 'classnames';
import styles from './SortOption.css';
import PropTypes from 'prop-types';
import { PLUGIN_NAME } from '../../constants';

export default class SortOption extends React.Component {
  render() {
    const className = cn([
      styles.label,
      `${PLUGIN_NAME}-sort-option`,
      { [`${PLUGIN_NAME}-sort-option-active`]: this.props.active },
    ]);
    return (
      <label className={className}>
        <input
          type="radio"
          onChange={this.props.setSort}
          checked={this.props.active}
          className={styles.input}
        />
        {this.props.label}
      </label>
    );
  }
}

SortOption.propTypes = {
  // A simple callback to be called when clicking on this sort option.
  setSort: PropTypes.func.isRequired,

  // Whether or not this sort option is active.
  active: PropTypes.bool.isRequired,

  // Label to show next to the input control.
  label: PropTypes.string.isRequired,
};
