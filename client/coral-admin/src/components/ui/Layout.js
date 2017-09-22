import React from 'react';
import PropTypes from 'prop-types';
import {Layout as LayoutMDL} from 'react-mdl';
import Header from './Header';
import Drawer from './Drawer';
import styles from './Layout.css';

const Layout = ({
  children,
  handleLogout = () => {},
  toggleShortcutModal = () => {},
  restricted = false,
  root,
  auth,
}) => (
  <LayoutMDL className={styles.layout} fixedDrawer>
    <Header
      handleLogout={handleLogout}
      showShortcuts={toggleShortcutModal}
      root={root}
      auth={auth}
    />
    <Drawer 
      handleLogout={handleLogout}
      restricted={restricted}
    />
    <div className={styles.layout}>
      {children}
    </div>
  </LayoutMDL>
);

Layout.propTypes = {
  children: PropTypes.node,
  auth: PropTypes.object,
  root: PropTypes.object,
  handleLogout: PropTypes.func,
  toggleShortcutModal: PropTypes.func,
  restricted: PropTypes.bool // hide elements from a user that's logged out
};

export default Layout;
