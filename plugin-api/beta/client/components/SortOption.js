import React from 'react';
import cn from 'classnames';
import styles from './SortOption.css';
import PropTypes from 'prop-types';

const pluginName = 'talk-slot-viewing-options-sort-option';

export default class SortOption extends React.Component {

  render() {
    return (
      <label className={cn([
        styles.label,
        pluginName,
        { [`${pluginName}-active`]: this.props.active },
      ])}>
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
