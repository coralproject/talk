import React from 'react';
import {compose} from 'react-apollo';
import {mostFlags, mostLikes} from 'coral-admin/src/graphql/queries';
import {Spinner} from 'coral-ui';
import styles from './Dashboard.css';
import FlagWidget from '../../components/FlagWidget';
import LikeWidget from '../../components/LikeWidget';

class Dashboard extends React.Component {
  render () {

    const {data} = this.props;
    console.log('data', data);
    const {metrics: assets} = data;

    if (data.loading) {
      return <Spinner />;
    }

    if (data.error) {
      return <code><pre>{data.error}</pre></code>;
    }

    return (
      <div className={styles.Dashboard}>
        <div className={styles.widget}>
          <h2 className={styles.heading}>Top Ten Articles with the most flagged comments</h2>
          <FlagWidget assets={assets} />
        </div>
        <div className={styles.widget}>
          <h2 className={styles.heading}>Top ten comments with the most likes</h2>
        </div>
        <div className={styles.widget}>
          <h2 className={styles.heading}>Top Ten Articles with the most likes</h2>
          <LikeWidget assets={assets} />
        </div>
      </div>
    );
  }
}

export default compose(
  mostFlags,
  mostLikes
)(Dashboard);
