import React, {Component, PropTypes} from 'react';
import {Icon} from 'coral-ui';
import styles from './FlagBox.css';
import t from 'coral-framework/services/i18n';

const shortReasons = {
  'This comment is offensive': t('modqueue.offensive'),
  'This looks like an ad/marketing': t('modqueue.spam_ads'),
  'This user is impersonating': t('modqueue.impersonating'),
  'I don\'t like this username': t('modqueue.dont_like_username'),
  'Other': t('modqueue.other')
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
            <Icon name='flag'/><h3>{t('community.flags')} ({actionSummaries.length}):</h3>
            <ul>
              {actionSummaries.map((action, i) =>
                <li key={i} className={styles.lessDetail}> {this.reasonMap(action.reason)} (<strong>{action.count}</strong>)</li>
              )}
            </ul>
            <a onClick={this.toggleDetail} className={styles.moreDetail}>{showDetail ? t('modqueue.less_detail') : t('modqueue.more_detail')}</a>
          </div>
          {showDetail && (
            <div className={styles.detail}>
              <ul>
                {actionSummaries.map((summary, i) => {

                  const actionList = actions.filter((a) => a.reason === summary.reason);

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
    reason: PropTypes.string,
    count: PropTypes.number
  })).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    user: PropTypes.shape({username: PropTypes.string})
  })).isRequired
};

export default FlagBox;
