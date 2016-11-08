import React from 'react'
import { Navigation, Header } from 'react-mdl'
import { Link } from 'react-router'
import styles from './Header.css'

export default () => (
    <Header title='Talk'>
      <Navigation>
        <Link className={styles.navLink} to="/">Moderate</Link>
        <Link className={styles.navLink} to="community">Community</Link>
        <Link className={styles.navLink} to="configure">Configure</Link>
      </Navigation>
    </Header>
)
