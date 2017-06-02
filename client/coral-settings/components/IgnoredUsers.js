import React, {Component, PropTypes} from 'react';
import t from 'coral-framework/services/i18n';
import styles from './IgnoredUsers.css';

export class IgnoredUsers extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string,
    })).isRequired,

    // accepts { id }
    stopIgnoring: PropTypes.func.isRequired,
  }
  render() {
    const {users, stopIgnoring} = this.props;
    return (
      <div>
        {
          users.length
            ? <p>{t('framework.because_you_ignored')}</p>
            : null
        }
        <dl className={styles.ignoredUserList}>
          {
            users.map(({username, id}) => (
              <span className={styles.ignoredUser} key={id}>
                <dt key={id}>{ username }</dt>
                <dd className={styles.stopListening}>
                  <a
                    onClick={() => stopIgnoring({id})}
                    className={styles.link}>{t('framework.stop_ignoring')}</a>
                </dd>
              </span>
            ))
          }
        </dl>
      </div>
    );
  }
}

export default IgnoredUsers;
