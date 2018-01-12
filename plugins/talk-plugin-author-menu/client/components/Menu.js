import React from 'react';
import styles from './Menu.css';
import { Slot } from 'plugin-api/beta/client/components';
import cn from 'classnames';

export default ({ data, root, asset, comment, contentSlot }) => {
  if (contentSlot) {
    return (
      <div className={cn(styles.menu, 'talk-plugin-author-menu-popup')}>
        <Slot
          fill={contentSlot}
          data={data}
          queryData={{ asset, root, comment }}
        />
      </div>
    );
  }

  return (
    <div className={cn(styles.menu, 'talk-plugin-author-menu-popup')}>
      <Slot
        className={cn('talk-plugin-author-menu-infos')}
        fill={'authorMenuInfos'}
        data={data}
        queryData={{ asset, root, comment }}
      />
      <Slot
        className={cn(styles.actions, 'talk-plugin-author-menu-actions')}
        fill={'authorMenuActions'}
        data={data}
        queryData={{ asset, root, comment }}
      />
    </div>
  );
};
