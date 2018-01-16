import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './Menu.css';
import { t } from 'plugin-api/beta/client/services';

const Menu = ({ className = '', children }) => (
  <div className={cn(styles.menu, className)}>
    <h3 className={styles.headline}>
      {t('talk-plugin-moderation-actions.moderation_actions')}
    </h3>
    {children}
  </div>
);

Menu.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Menu;
