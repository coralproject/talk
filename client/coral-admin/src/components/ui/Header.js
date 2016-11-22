import React from 'react';
import {Navigation, Header} from 'react-mdl';
import {Link, IndexLink} from 'react-router';
import styles from './Header.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import {Logo} from './Logo';

export default () => (
  <Header className={styles.header}>
    <Logo />
    <Navigation>
      <IndexLink className={styles.navLink} to="/admin" activeClassName={styles.active}>{lang.t('configure.moderate')}</IndexLink>
      <Link className={styles.navLink} to="/admin/community" activeClassName={styles.active}>{lang.t('configure.community')}</Link>
      <Link className={styles.navLink} to="/admin/configure" activeClassName={styles.active}>{lang.t('configure.configure')}</Link>
    </Navigation>
    <div className={styles.version}>
      {`v${process.env.VERSION}`}
    </div>
  </Header>
);

const lang = new I18n(translations);
