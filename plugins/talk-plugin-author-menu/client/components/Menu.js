import React from 'react';
import styles from './Menu.css';
import {Slot} from 'plugin-api/beta/client/components';

export default ({data, root, asset, comment, contentSlot}) => {
  if (contentSlot) {
    return (
      <div className={styles.menu}>
        <Slot
          fill={contentSlot}
          data={data}
          queryData={{asset, root, comment}}
        />
      </div>
    );
  }

  return (
    <div className={styles.menu}>
      <Slot
        fill={'authorMenuInfos'}
        data={data}
        queryData={{asset, root, comment}}
      />
      <Slot
        className={styles.actions}
        fill={'authorMenuActions'}
        data={data}
        queryData={{asset, root, comment}}
      />
    </div>
  );
};
