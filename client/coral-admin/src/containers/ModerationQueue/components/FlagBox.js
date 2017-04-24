import React, {Component, PropTypes} from 'react';
import {Icon} from 'coral-ui';
import styles from './FlagBox.css';
import I18n from 'coral-i18n/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
const lang = new I18n(translations);

const shortReasons = {
  'This comment is offensive': lang.t('modqueue.offensive'),
  'This looks like an ad/marketing': lang.t('modqueue.spam/ads'),
  'This user is impersonating': lang.t('modqueue.impersonating'),
  'I don\'t like this username': lang.t('modqueue.dont-like-username'),
  'Other': lang.t('modqueue.other')
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
            <a onClick={this.toggleDetail} className={styles.moreDetail}>{showDetail ? lang.t('modqueue.less-detail') : lang.t('modqueue.more-detail')}</a>
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
    reason: PropTypes.string,
    count: PropTypes.number
  })).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    user: PropTypes.shape({username: PropTypes.string})
  })).isRequired
};

export default FlagBox;
