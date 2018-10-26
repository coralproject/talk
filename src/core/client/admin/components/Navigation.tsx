import { Link } from "found";
import React, { StatelessComponent } from "react";

import { Button, Flex, Typography } from "talk-ui/components";

import SignOutButtonContainer from "../containers/SignOutButtonContainer";
import styles from "./Navigation.css";

const Navigation: StatelessComponent = () => (
  <Flex itemGutter="double">
    <Typography variant="heading1">Talk</Typography>
    <Link
      to="/admin/moderate"
      className={styles.link}
      activeClassName={styles.active}
    >
      <Button>Moderate</Button>
    </Link>
    <Link
      to="/admin/community"
      className={styles.link}
      activeClassName={styles.active}
    >
      <Button>Community</Button>
    </Link>
    <Link
      to="/admin/stories"
      className={styles.link}
      activeClassName={styles.active}
    >
      <Button>Stories</Button>
    </Link>
    <Link
      to="/admin/configure"
      className={styles.link}
      activeClassName={styles.active}
    >
      <Button>Configure</Button>
    </Link>
    <SignOutButtonContainer />
  </Flex>
);

export default Navigation;
