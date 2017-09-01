import React from 'react';
import styles from './Menu.css';
import {Slot} from 'plugin-api/beta/client/components';

export default ({data, root, asset, comment}) => (
  <div className={styles.menu}>
    <Slot
      fill={'authorMenuInfos'}
      data={data}
      queryData={{asset, root, comment}}
    />
    <Slot
      fill={'authorMenuActions'}
      data={data}
      queryData={{asset, root, comment}}
    />
  </div>
);
