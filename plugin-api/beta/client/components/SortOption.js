import React from 'react';
import styles from './SortOption.css';

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
