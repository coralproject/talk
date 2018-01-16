import React from 'react';
import styles from './SortOption.css';
import PropTypes from 'prop-types';

export default class SortOption extends React.Component {
  render() {
    return (
      <label className={styles.label}>
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
