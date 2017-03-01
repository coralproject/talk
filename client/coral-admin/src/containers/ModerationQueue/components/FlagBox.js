import React, {Component, PropTypes} from 'react';
import {Icon} from 'coral-ui';
import styles from './FlagBox.css';

class FlagBox extends Component {
  constructor () {
    super();
    this.state = {
      showDetail: false
    };
  }

  toggleDetail = () => {
    this.setState((state) => ({
      showDetail: !state.showDetail
    }));
  }

  render() {
    const {props} = this;
    return (
      <div className={styles.flagBox}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Icon name='flag'/><h3>Flags ({props.actionSummaries.length}):</h3>
            <ul>
              {props.actionSummaries.map((action, i) =>
                <li key={i}>{!action.reason ? <i>No reason provided</i> : action.reason} (<strong>{action.count}</strong>)</li>
              )}
            </ul>
            <a onClick={this.toggleDetail} className={styles.moreDetail}>More detail</a>
          </div>
          {this.state.showDetail && (<div className={styles.detail}>
            <ul>
              {props.actionSummaries.map((action, i) =>
                <li key={i}>{!action.reason ? <i>No reason provided</i> : action.reason} (<strong>{action.count}</strong>)</li>
              )}
            </ul>
          </div>)}
        </div>
      </div>
    );
  }
}

FlagBox.propTypes = {
  actionSummaries: PropTypes.array.isRequired
};

export default FlagBox;
