import React, {Component, PropTypes} from 'react';
import {Icon} from 'coral-ui';
import styles from './FlagBox.css';

const shortReasons = {
  'This comment is offensive': 'Offensive',
  'This looks like an ad/marketing': 'Spam/Ads',
  'Other': 'other'
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
    const {actionSummaries, actions} = this.props;
    const {showDetail} = this.state;

    return (
      <div className={styles.flagBox}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Icon name='flag'/><h3>Flags ({actionSummaries.length}):</h3>
            <ul>
              {actionSummaries.map((action, i) =>
                <li key={i} className={styles.lessDetail}>{this.reasonMap(action.reason)} (<strong>{action.count}</strong>)</li>
              )}
            </ul>
            <a onClick={this.toggleDetail} className={styles.moreDetail}>{showDetail ? 'Less' : 'More'} detail</a>
          </div>
          {showDetail && (
            <div className={styles.detail}>
              <ul>
                {actionSummaries.map((summary, i) => {

                  const actionList = actions.filter(a => a.reason === summary.reason);

                  return (
                    <li key={i}>
                      {this.reasonMap(summary.reason)} (<strong>{summary.count}</strong>)
                      <ul>
                        {
                          actionList.map((action, j) => <li key={`${i}_${j}`} className={styles.subDetail}><span>{action.user.username}</span> {action.message}</li>)
                        }
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
}

FlagBox.propTypes = {
  actionSummaries: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired
};

export default FlagBox;
