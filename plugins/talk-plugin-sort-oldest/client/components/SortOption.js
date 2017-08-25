import React from 'react';
import styles from './SortOption.css';

export default class SortOption extends React.Component {
  render() {
    return (
      <div className={styles.viewingOption}>
        <input type="radio" onChange={this.props.setSort} checked={this.props.active} className={styles.input}/>
        <label className={styles.label} onClick={this.props.setSort}>
          {this.props.label}
        </label>
      </div>
    );
  }
}
