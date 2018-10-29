import { Link } from "found";
import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import SignOutButtonContainer from "../containers/SignOutButtonContainer";
import styles from "./Navigation.css";

const Navigation: StatelessComponent = () => (
  <Flex className={styles.root} justifyContent="space-between">
    <Flex alignItems="center">
      <Link
        to="/admin/moderate"
        className={styles.link}
        activeClassName={styles.active}
      >
        Moderate
      </Link>
      <Link
        to="/admin/community"
        className={styles.link}
        activeClassName={styles.active}
      >
        Community
      </Link>
      <Link
        to="/admin/stories"
        className={styles.link}
        activeClassName={styles.active}
      >
        Stories
      </Link>
      <Link
        to="/admin/configure"
        className={styles.link}
        activeClassName={styles.active}
      >
        Configure
      </Link>
    </Flex>
    <Flex alignItems="center">
      <SignOutButtonContainer />
    </Flex>
  </Flex>
);

export default Navigation;
