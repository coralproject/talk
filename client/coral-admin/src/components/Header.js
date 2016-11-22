import React from 'react';
import {Layout, Navigation, Drawer, Header} from 'react-mdl';
import {Link} from 'react-router';
import styles from './Header.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';

// App header. If we add a navbar it should be here
export default (props) => (
  <Layout fixedDrawer>
    <Header title='Talk'>
      <Navigation>
        <Link className={styles.navLink} to='/'>{lang.t('configure.moderate')}</Link>
        <Link className={styles.navLink} to='configure'>{lang.t('Configure')}</Link>
      </Navigation>
    </Header>
    <Drawer>
      <Navigation>
        <Link className={styles.navLink} to='/'>{lang.t('configure.moderate')}</Link>
        <Link className={styles.navLink} to='configure'>{lang.t('configure.Configure')}</Link>
      </Navigation>
    </Drawer>
    {props.children}
  </Layout>
);

const lang = new I18n(translations);
