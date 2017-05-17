import React, {PropTypes} from 'react';
import {Navigation, Header, IconButton, MenuItem, Menu} from 'react-mdl';
import {Link, IndexLink} from 'react-router';
import styles from './Header.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import {Logo} from './Logo';
import {can} from 'coral-framework/utils/roles';

const CoralHeader = ({
  handleLogout,
  showShortcuts = () => {},
  restricted = false,
  auth
}) => (
  <Header className={styles.header}>
    <Logo className={styles.logo} />
    {
      !restricted ?
      <div>
        <Navigation className={styles.nav}>
          <IndexLink
            id='dashboardNav'
            className={styles.navLink}
            to="/admin/dashboard"
            activeClassName={styles.active}>
            {lang.t('configure.dashboard')}
          </IndexLink>
          <Link
            id='moderateNav'
            className={styles.navLink}
            to="/admin/moderate"
            activeClassName={styles.active}>
            {lang.t('configure.moderate')}
          </Link>
          <Link
            id='streamsNav'
            className={styles.navLink}
            to="/admin/stories"
            activeClassName={styles.active}>
            {lang.t('configure.stories')}
          </Link>
          <Link
            id='communityNav'
            className={styles.navLink}
            to="/admin/community"
            activeClassName={styles.active}>
            {lang.t('configure.community')}
          </Link>
          {
            auth && auth.user && can(auth.user, 'UPDATE_CONFIG') && (
              <Link
                id='configureNav'
                className={styles.navLink}
                to="/admin/configure"
                activeClassName={styles.active}>
                {lang.t('configure.configure')}
              </Link>
            )
          }
        </Navigation>
        <div className={styles.rightPanel}>
          <ul>
            <li className={styles.settings}>
              <div>
                <IconButton name="settings" id="menu-settings"/>
                <Menu target="menu-settings" align="right">
                  <MenuItem onClick={() => showShortcuts(true)}>{lang.t('configure.shortcuts')}</MenuItem>
                  <MenuItem onClick={handleLogout}>{lang.t('configure.sign-out')}</MenuItem>
                </Menu>
              </div>
            </li>
            <li>
              {`v${process.env.VERSION}`}
            </li>
          </ul>
        </div>
      </div>
    :
    null
  }
  </Header>
);

CoralHeader.propTypes = {
  auth: PropTypes.object,
  showShortcuts: PropTypes.func,
  handleLogout: PropTypes.func.isRequired,
  restricted: PropTypes.bool // hide elemnts from a user that's logged out
};

const lang = new I18n(translations);

export default CoralHeader;
