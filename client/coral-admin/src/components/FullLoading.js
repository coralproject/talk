import React from 'react';
import { Layout } from 'react-mdl';
import styles from './FullLoading.css';
import { CoralLogo } from 'coral-ui';

export const FullLoading = () => (
  <Layout fixedDrawer>
    <div className={styles.layout}>
      <h1>Loading</h1>
      <CoralLogo />
    </div>
  </Layout>
);
