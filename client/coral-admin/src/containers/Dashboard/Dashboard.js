import React from 'react';
import styles from './Dashboard.css';
import FlagWidget from '../../components/FlagWidget';
import LikeWidget from '../../components/LikeWidget';

const Dashboard = () => {
  return (
    <div className={styles.Dashboard}>
      <div className={styles.widget}>
        <FlagWidget />
      </div>
      <div className={styles.widget}>
        <h2 className={styles.heading}>Top ten comments with the most likes</h2>
      </div>
      <div className={styles.widget}>
        <LikeWidget />
      </div>
    </div>
  );
};

export default Dashboard;
