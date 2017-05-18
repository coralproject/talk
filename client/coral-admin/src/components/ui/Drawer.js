import React, {PropTypes} from 'react';
import {Navigation, Drawer} from 'react-mdl';
import {IndexLink, Link} from 'react-router';
import styles from './Drawer.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import {can} from 'coral-framework/utils/roles';

const CoralDrawer = ({handleLogout, auth}) => (
  <Drawer className={styles.header}>
    { auth && auth.user && can(auth.user, 'ACCESS_ADMIN') ?
      <div>
        <Navigation className={styles.nav}>
          <IndexLink
            className={styles.navLink}
            to="/admin/dashboard"
            activeClassName={styles.active}>
            {lang.t('configure.dashboard')}
          </IndexLink>
          {
            can(auth.user, 'MODERATE_COMMENTS') && (
              <Link
                className={styles.navLink}
                to="/admin/moderate"
                activeClassName={styles.active}>
                {lang.t('configure.moderate')}
              </Link>
            )
          }
          <Link className={styles.navLink}
            to="/admin/stories"
            activeClassName={styles.active}>
            {lang.t('configure.stories')}
          </Link>
          <Link className={styles.navLink}
            to="/admin/community"
            activeClassName={styles.active}>
            {lang.t('configure.community')}
          </Link>
          {
            can(auth.user, 'UPDATE_CONFIG') &&
            (
              <Link
                className={styles.navLink}
                to="/admin/configure"
                activeClassName={styles.active}>
                {lang.t('configure.configure')}
              </Link>
            )
          }
          <a onClick={handleLogout}>Sign Out</a>
          <span>{`v${process.env.VERSION}`}</span>
        </Navigation>
      </div> : null }
  </Drawer>
);

CoralDrawer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  restricted: PropTypes.bool // hide app elements from a logged out user
};

const lang = new I18n(translations);

export default CoralDrawer;
