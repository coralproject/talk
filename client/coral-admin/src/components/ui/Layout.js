import React from 'react';
import {Layout as LayoutMDL} from 'react-mdl';
import Header from './Header';
import Drawer from './Drawer';
import styles from './Layout.css';

export const Layout = ({children, ...props}) => (
  <LayoutMDL fixedDrawer>
    <Header {...props}/>
    <Drawer />
    <div className={styles.layout} >
      {children}
    </div>
  </LayoutMDL>
);
