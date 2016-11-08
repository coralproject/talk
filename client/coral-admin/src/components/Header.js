import React from 'react'
import { Layout, Navigation, Drawer, Header } from 'react-mdl'
import { Link } from 'react-router'
import styles from './Header.css'
import config from 'services/config'

// App header. If we add a navbar it should be here
export default (props) => (
  <Layout fixedDrawer>
    <Header title='Talk'>
      <Navigation>
        <Link className={styles.navLink} to={`/${config.basePath}/`}>Moderate</Link>
        <Link className={styles.navLink} to={`/${config.basePath}/configure`}>Configure</Link>
      </Navigation>
    </Header>
    <Drawer>
      <Navigation>
        <Link className={styles.navLink} to={`/${config.basePath}/`}>Moderate</Link>
        <Link className={styles.navLink} to={`/${config.basePath}/configure`}>Configure</Link>
      </Navigation>
    </Drawer>
    {props.children}
  </Layout>
)
