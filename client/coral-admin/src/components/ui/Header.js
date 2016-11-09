import React from 'react';
import {Navigation, Header} from 'react-mdl';
import {Link} from 'react-router';
import styles from './Header.css';

export default () => (
  <Header title='Talk'>
    <Navigation>
      <Link className={styles.navLink} to="/admin">Moderate</Link>
      <Link className={styles.navLink} to="/admin/community">Community</Link>
      <Link className={styles.navLink} to="/admin/configure">Configure</Link>
    </Navigation>
  </Header>
);
