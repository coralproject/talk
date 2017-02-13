import React from 'react';
import {Navigation, Header, IconButton, MenuItem, Menu} from 'react-mdl';
import {Link, IndexLink} from 'react-router';
import styles from './Header.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import {Logo} from './Logo';

export default ({handleLogout, restricted = false}) => (
  <Header className={styles.header}>
    <Logo />
    {
      !restricted ?
      <div>
        <Navigation className={styles.nav}>
          <IndexLink className={styles.navLink} to="/admin/moderate"
                     activeClassName={styles.active}>
                     {lang.t('configure.moderate')}
         </IndexLink>
          <Link className={styles.navLink} to="/admin/streams"
                activeClassName={styles.active}>
            {lang.t('configure.streams')}
          </Link>
          <Link className={styles.navLink} to="/admin/community"
                activeClassName={styles.active}>
                {lang.t('configure.community')}
          </Link>
          <Link className={styles.navLink} to="/admin/configure"
                activeClassName={styles.active}>
                {lang.t('configure.configure')}
          </Link>
        </Navigation>
        <div className={styles.rightPanel}>
          <ul>
            <li className={styles.settings}>
              <div>
                <IconButton name="settings" id="menu-settings"/>
                <Menu target="menu-settings" align="right">
                  <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
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

const lang = new I18n(translations);
