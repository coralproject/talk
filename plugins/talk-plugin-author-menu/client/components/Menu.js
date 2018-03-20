import React from 'react';
import PropTypes from 'prop-types';
import styles from './Menu.css';
import { Slot } from 'plugin-api/beta/client/components';
import cn from 'classnames';

const Menu = ({ slotPassthrough, contentSlot }) => {
  if (contentSlot) {
    return (
      <div className={cn(styles.menu, 'talk-plugin-author-menu-popup')}>
        <Slot fill={contentSlot} passthrough={slotPassthrough} />
      </div>
    );
  }

  return (
    <div className={cn(styles.menu, 'talk-plugin-author-menu-popup')}>
      <Slot
        className={cn('talk-plugin-author-menu-infos')}
        fill={'authorMenuInfos'}
        passthrough={slotPassthrough}
      />
      <Slot
        className={cn(styles.actions, 'talk-plugin-author-menu-actions')}
        fill={'authorMenuActions'}
        passthrough={slotPassthrough}
      />
    </div>
  );
};

Menu.propTypes = {
  slotPassthrough: PropTypes.object.isRequired,
  contentSlot: PropTypes.string,
};

export default Menu;
