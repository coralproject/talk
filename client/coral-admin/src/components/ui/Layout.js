import React from 'react';
import {Layout as LayoutMDL} from 'react-mdl';
import Header from './Header';
import Drawer from './Drawer';

export const Layout = ({children}) => (
  <LayoutMDL fixedDrawer>
    <Header />
    <Drawer />
    {children}
  </LayoutMDL>
);
