import React from 'react';
import Menu from './Menu';
import styles from './AuthorName.css';
import {ClickOutside} from 'plugin-api/beta/client/components';

export default ({data, root, asset, comment, contentSlot, menuVisible, toggleMenu, hideMenu}) => {
  return (
    <ClickOutside onClickOutside={hideMenu}>
      <div className={styles.root}>
        <button
          className={styles.button}
          onClick={toggleMenu}
        >
          <span className={styles.name}>
            {comment.user.username}
          </span>
        </button>
        {menuVisible &&
          <Menu
            data={data}
            root={root}
            asset={asset}
            comment={comment}
            contentSlot={contentSlot}
          />
        }
      </div>
    </ClickOutside>
  );
};
