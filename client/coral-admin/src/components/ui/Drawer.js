import React from 'react'
import { Navigation, Drawer } from 'react-mdl'
import { Link } from 'react-router'
import styles from './Header.css'
import config from 'services/config'

export default () => (
  <Drawer>
    <Navigation>
      <Link className={styles.navLink} to={`/${config.basePath}/`}>Moderate</Link>
      <Link className={styles.navLink} to={`/${config.basePath}/configure`}>Configure</Link>
    </Navigation>
  </Drawer>
)
