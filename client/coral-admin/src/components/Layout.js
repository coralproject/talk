import React from 'react';
import PropTypes from 'prop-types';
import { Layout as LayoutMDL } from 'react-mdl';
import Header from '../containers/Header';
import Drawer from './Drawer';
import styles from './Layout.css';

const Layout = ({
  children,
  handleLogout = () => {},
  toggleShortcutModal = () => {},
  restricted = false,
  auth,
}) => (
  <LayoutMDL className={styles.layout} fixedDrawer>
    <Header
      handleLogout={handleLogout}
      showShortcuts={toggleShortcutModal}
      auth={auth}
    />
    <Drawer handleLogout={handleLogout} restricted={restricted} auth={auth} />
    <div className={styles.layout}>{children}</div>
  </LayoutMDL>
);

Layout.propTypes = {
  children: PropTypes.node,
  auth: PropTypes.object,
  handleLogout: PropTypes.func,
  toggleShortcutModal: PropTypes.func,
  restricted: PropTypes.bool, // hide elements from a user that's logged out
};

export default Layout;
