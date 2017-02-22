import React from 'react';
import styles from './Dashboard.css';
import FlagWidget from './FlagWidget';
import LikeWidget from './LikeWidget';
import MostLikedCommentsWidget from './MostLikedCommentsWidget';

const Dashboard = () => {
  return (
    <div className={styles.Dashboard}>
      <FlagWidget />
      <MostLikedCommentsWidget />
      <LikeWidget />
    </div>
  );
};

export default Dashboard;
