import React from 'react'
import { Layout, Navigation, Drawer, Header } from 'react-mdl'
import styles from './Header.css'

// App header. If we add a navbar it should be here
export default (props) => (
  <Layout fixedDrawer>
    <Header title='Talk'>
      <Navigation>
        <a className={styles.navLink} href='/'>Moderate</a>
        <a className={styles.navLink} href='/configure'>Configure</a>
      </Navigation>
    </Header>
    <Drawer>
      <Navigation>
        <a className={styles.navLink} href='/'>Moderate</a>
        <a className={styles.navLink} href='/configure'>Configure</a>
      </Navigation>
    </Drawer>
    {props.children}
  </Layout>
)
