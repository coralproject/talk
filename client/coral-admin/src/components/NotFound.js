import React from 'react';
import { Layout } from 'react-mdl';
import styles from './NotFound.css';

export const NotFound = () => (
  <Layout fixedDrawer>
    <div className={styles.layout}>
      <h1>Page Not Found</h1>
      <p>The communicorn feels your pain.</p>
      <img
        src="https://coralproject.net/images/communicorn.jpg"
        alt="Communicorn"
      />
    </div>
  </Layout>
);
