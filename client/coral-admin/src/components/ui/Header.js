import React from 'react';
import {Navigation, Header} from 'react-mdl';
import {Link} from 'react-router';
import styles from './Header.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import {Logo} from './Logo';

export default () => (
  <Header className={styles.header}>
    <Logo />
    <Navigation>
      <Link className={styles.navLink} to="/admin">{lang.t('configure.moderate')}</Link>
      <Link className={styles.navLink} to="/admin/community">{lang.t('configure.community')}</Link>
      <Link className={styles.navLink} to="/admin/configure">{lang.t('configure.configure')}</Link>
      <span>
        {`v${process.env.VERSION}`}
      </span>
    </Navigation>
  </Header>
);

const lang = new I18n(translations);
