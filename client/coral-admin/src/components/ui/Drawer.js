import React, {PropTypes} from 'react';
import {Navigation, Drawer} from 'react-mdl';
import {IndexLink, Link} from 'react-router';
import styles from './Drawer.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';

const CoralDrawer = ({handleLogout, restricted = false}) => (
  <Drawer className={styles.header}>
    { !restricted ?
      <div>
        <Navigation className={styles.nav}>
          <IndexLink
            className={styles.navLink}
            to="/admin/dashboard"
            activeClassName={styles.active}>
            {lang.t('configure.dashboard')}
          </IndexLink>
          <Link
            className={styles.navLink}
            to="/admin/moderate"
            activeClassName={styles.active}>
            {lang.t('configure.moderate')}
          </Link>
          <Link className={styles.navLink}
                to="/admin/streams"
                activeClassName={styles.active}>
            {lang.t('configure.streams')}
          </Link>
          <Link className={styles.navLink}
                to="/admin/community"
                activeClassName={styles.active}>
            {lang.t('configure.community')}
          </Link>
          <Link
            className={styles.navLink}
            to="/admin/configure"
            activeClassName={styles.active}>
            {lang.t('configure.configure')}
          </Link>
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
