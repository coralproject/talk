import React from 'react';
import Menu from './Menu';
import styles from './AuthorName.css';
import { ClickOutside } from 'plugin-api/beta/client/components';
import cn from 'classnames';

export default ({
  data,
  root,
  asset,
  comment,
  contentSlot,
  menuVisible,
  toggleMenu,
  hideMenu,
}) => {
  return (
    <ClickOutside onClickOutside={hideMenu}>
      <div className={cn(styles.root, 'talk-plugin-author-menu')}>
        <button
          className={cn(styles.button, 'talk-plugin-author-menu-button')}
          onClick={toggleMenu}
        >
          <span className={styles.name}>{comment.user.username}</span>
        </button>
        {menuVisible && (
          <Menu
            data={data}
            root={root}
            asset={asset}
            comment={comment}
            contentSlot={contentSlot}
          />
        )}
      </div>
    </ClickOutside>
  );
};
