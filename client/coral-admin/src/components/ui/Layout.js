import React, {PropTypes} from 'react';
import {Layout as LayoutMDL} from 'react-mdl';
import Header from './Header';
import Drawer from './Drawer';
import styles from './Layout.css';

const Layout = ({
  children,
  handleLogout = () => {},
  toggleShortcutModal,
  restricted = false,
  ...props}) => (
  <LayoutMDL fixedDrawer>
    <Header
      handleLogout={handleLogout}
      showShortcuts={toggleShortcutModal}
      restricted={restricted}
      {...props} />
    <Drawer handleLogout={handleLogout} restricted={restricted} {...props} />
    <div className={styles.layout}>
      {children}
    </div>
  </LayoutMDL>
);

Layout.propTypes = {
  handleLogout: PropTypes.func,
  toggleShortcutModal: PropTypes.func,
  restricted: PropTypes.bool // hide elements from a user that's logged out
};

export default Layout;
