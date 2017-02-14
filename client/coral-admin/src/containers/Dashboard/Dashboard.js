import React from 'react';
import {compose} from 'react-apollo';
import {mostFlags} from 'coral-admin/src/graphql/queries';
import styles from './Dashboard.css';

class Dashboard extends React.Component {
  render () {
    return (
      <div className={styles.Dashboard}>
        <div className={`${styles.flagWidget} ${styles.widget}`}>
          <h2 className={styles.heading}>Top Ten Articles with the most flagged comments</h2>
          <table>
            <thead>
              <tr><th>Article</th><th>Flags</th></tr>
            </thead>
          </table>
        </div>
        <div className={`${styles.likeWidget} ${styles.widget}`}>
          <h2 className={styles.heading}>Top ten comments with the most likes</h2>
        </div>
      </div>
    );
  }
}

export default compose(
  mostFlags
)(Dashboard);
