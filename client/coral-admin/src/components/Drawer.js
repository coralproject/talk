import React from 'react';
import PropTypes from 'prop-types';
import { Navigation, Drawer } from 'react-mdl';
import { IndexLink, Link } from 'react-router';
import styles from './Drawer.css';
import t from 'coral-framework/services/i18n';
import { can } from 'coral-framework/services/perms';
import cn from 'classnames';

const CoralDrawer = ({ handleLogout, currentUser }) =>
  currentUser && can(currentUser, 'ACCESS_ADMIN') ? (
    <Drawer className={cn('talk-admin-drawer-nav', styles.drawer)}>
      <div>
        <Navigation className={styles.nav}>
          {can(currentUser, 'MODERATE_COMMENTS') && (
            <IndexLink
              className={cn('talk-admin-nav-moderate', styles.navLink)}
              to="/admin/moderate"
              activeClassName={styles.active}
            >
              {t('configure.moderate')}
            </IndexLink>
          )}
          <Link
            className={cn('talk-admin-nav-stories', styles.navLink)}
            to="/admin/stories"
            activeClassName={styles.active}
          >
            {t('configure.stories')}
          </Link>
          <Link
            className={cn('talk-admin-nav-community', styles.navLink)}
            to="/admin/community"
            activeClassName={styles.active}
          >
            {t('configure.community')}
          </Link>
          {can(currentUser, 'UPDATE_CONFIG') && (
            <Link
              className={cn('talk-admin-nav-configure', styles.navLink)}
              to="/admin/configure"
              activeClassName={styles.active}
            >
              {t('configure.configure')}
            </Link>
          )}
          <a onClick={handleLogout}>{t('configure.sign_out')}</a>
          <span>{`v${process.env.VERSION}`}</span>
        </Navigation>
      </div>
    </Drawer>
  ) : null;

CoralDrawer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  restricted: PropTypes.bool, // hide app elements from a logged out user
  currentUser: PropTypes.object,
};

export default CoralDrawer;
