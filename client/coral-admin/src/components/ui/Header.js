import React from 'react';
import PropTypes from 'prop-types';
import {Navigation, Header, IconButton, MenuItem, Menu} from 'react-mdl';
import {Link, IndexLink} from 'react-router';
import styles from './Header.css';
import t from 'coral-framework/services/i18n';
import {Logo} from './Logo';
import {can} from 'coral-framework/services/perms';
import Indicator from './Indicator';

const CoralHeader = ({
  handleLogout,
  showShortcuts = () => {},
  auth,
  root
}) => {
  return (
    <Header className={styles.header}>
      <Logo className={styles.logo} />
      <div> 
        {
          auth && auth.user && can(auth.user, 'ACCESS_ADMIN') ?
            <Navigation className={styles.nav}>
              <IndexLink
                id='dashboardNav'
                className={styles.navLink}
                to="/admin/dashboard"
                activeClassName={styles.active}>
                {t('configure.dashboard')}
              </IndexLink>
              {
                can(auth.user, 'MODERATE_COMMENTS') && (
                  <Link
                    id='moderateNav'
                    className={styles.navLink}
                    to="/admin/moderate"
                    activeClassName={styles.active}>
                    {t('configure.moderate')}
                    {(root.premodCount !== 0 || root.reportedCount !== 0) && <Indicator />}
                  </Link>
                )
              }
              <Link
                id='streamsNav'
                className={styles.navLink}
                to="/admin/stories"
                activeClassName={styles.active}>
                {t('configure.stories')}
              </Link>

              <Link
                id='communityNav'
                className={styles.navLink}
                to="/admin/community"
                activeClassName={styles.active}>
                {t('configure.community')}
                {root.flaggedUsernamesCount !== 0 && <Indicator />}
              </Link>

              {
                can(auth.user, 'UPDATE_CONFIG') && (
                  <Link
                    id='configureNav'
                    className={styles.navLink}
                    to="/admin/configure"
                    activeClassName={styles.active}>
                    {t('configure.configure')}
                  </Link>
                )
              }
            </Navigation>
            :
            null
        }
        <div className={styles.rightPanel}>
          <ul>
            <li className={styles.settings}>
              <div>
                <IconButton name="settings" id="menu-settings"/>
                <Menu target="menu-settings" align="right">
                  <MenuItem onClick={() => showShortcuts(true)}>{t('configure.shortcuts')}</MenuItem>
                  <MenuItem>
                    <a href="https://github.com/coralproject/talk/releases" target="_blank" rel="noopener noreferrer">
                        View latest version
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="https://coralproject.net/contribute.html#other-ideas-and-bug-reports" target="_blank" rel="noopener noreferrer">
                        Report a bug or give feedback
                    </a>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    {t('configure.sign_out')}
                  </MenuItem>
                </Menu>
              </div>
            </li>
            <li>
              {`v${process.env.VERSION}`}
            </li>
          </ul>
        </div>
      </div>
    </Header>
  );
};

CoralHeader.propTypes = {
  auth: PropTypes.object,
  showShortcuts: PropTypes.func,
  handleLogout: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired
};

export default CoralHeader;
