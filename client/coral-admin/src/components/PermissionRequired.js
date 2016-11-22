import React from 'react';
import {Layout} from 'react-mdl';
import styles from './NotFound.css';

export const PermissionRequired = () => (
  <Layout fixedDrawer>
    <div className={styles.layout} >
      <h1>Permission Required</h1>
      <p>We’re sorry, but you don’t have access to that page.</p>
      <img src="https://coralproject.net/images/communicorn.jpg" alt="Communicorn"/>
    </div>
  </Layout>
);
