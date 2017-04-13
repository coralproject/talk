import React, {Component, PropTypes} from 'react';
import {Icon} from 'coral-ui';
import styles from './FlagBox.css';

const shortReasons = {
  'This comment is offensive': 'Offensive',
  'This looks like an ad/marketing': 'Spam/Ads'
};

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

  reasonMap = (reason) => {
    const shortReason = shortReasons[reason];

    // if the short reason isn't found, just return the long one.
    return shortReason ? shortReason : reason;
  }

  render() {
    const {props} = this;
    return (
      <div className={styles.flagBox}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Icon name='flag'/><h3>Flags ({props.actionSummaries.length}):</h3>
            <div>
              {props.actionSummaries.map((action, i) =>
                <span key={i}>{this.reasonMap(action.reason)} (<strong>{action.count}</strong>)</span>
              )}
            </div>
            <a onClick={this.toggleDetail} className={styles.moreDetail}>More detail</a>
          </div>
          {this.state.showDetail && (<div className={styles.detail}>
          <ul>
            {props.actionSummaries.map((action, i) =>
              <li key={i}>{this.reasonMap(action.reason)} (<strong>{action.count}</strong>)</li>
            )}
          </ul>
          </div>)}
        </div>
      </div>
    );
  }
}

FlagBox.propTypes = {
  actionSummaries: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired
};

export default FlagBox;
