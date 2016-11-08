import React from 'react'
import { Layout as LayoutMDL} from 'react-mdl'
import Header from '../Header'

export const Layout = ({ children }) => (
  <LayoutMDL fixedDrawer>>
    <Header />
    <Drawer />
    {children}
  </LayoutMDL>
)