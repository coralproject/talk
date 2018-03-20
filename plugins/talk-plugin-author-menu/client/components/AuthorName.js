import React from 'react';
import PropTypes from 'prop-types';
import Menu from './Menu';
import styles from './AuthorName.css';
import { ClickOutside } from 'plugin-api/beta/client/components';
import cn from 'classnames';

const AuthorName = ({
  slotPassthrough,
  username,
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
          <span className={styles.name}>{username}</span>
        </button>
        {menuVisible && (
          <Menu slotPassthrough={slotPassthrough} contentSlot={contentSlot} />
        )}
      </div>
    </ClickOutside>
  );
};

AuthorName.propTypes = {
  slotPassthrough: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  menuVisible: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  hideMenu: PropTypes.func.isRequired,
  contentSlot: PropTypes.string,
};

export default AuthorName;
