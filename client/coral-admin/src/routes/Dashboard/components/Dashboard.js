import React from 'react';
import FlagWidget from './FlagWidget';
import ActivityWidget from './ActivityWidget';
import CountdownTimer from './CountdownTimer';
import styles from './Dashboard.css';

export default ({root: {assetsByActivity, assetsByFlag}, reloadData}) => (
  <div>
    <CountdownTimer handleTimeout={reloadData} />
    <div className={styles.Dashboard}>
      <FlagWidget assets={assetsByFlag} />
      <ActivityWidget assets={assetsByActivity} />
    </div>
  </div>
);
