import React, {Component} from 'react';

import styles from './IgnoredUsers.css';

export class IgnoredUsers extends Component {
  render() {
    const {users} = this.props;
    return (
      <div>
        {
          users.length
            ? <p>Because you ignored these, you do not see their comments.</p>
            : null
        }
        <dl className={styles.ignoredUserList}>
          {
            users.map(({username, id}) => (
              <span className={styles.ignoredUser}>
                <dt key={id}>{ username }</dt>
                <dd className={styles.stopListening}>
                  <a className={styles.link}>Stop ignoring</a>
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
