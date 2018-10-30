import { Localized } from "fluent-react/compat";
import { Link } from "found";
import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import SignOutButtonContainer from "../containers/SignOutButtonContainer";
import styles from "./Navigation.css";

const Navigation: StatelessComponent = () => (
  <Flex className={styles.root} justifyContent="space-between">
    <Flex alignItems="center">
      <Localized id="general-navigation-moderate">
        <Link
          to="/admin/moderate"
          className={styles.link}
          activeClassName={styles.active}
        >
          Moderate
        </Link>
      </Localized>
      <Localized id="general-navigation-community">
        <Link
          to="/admin/community"
          className={styles.link}
          activeClassName={styles.active}
        >
          Community
        </Link>
      </Localized>
      <Localized id="general-navigation-stories">
        <Link
          to="/admin/stories"
          className={styles.link}
          activeClassName={styles.active}
        >
          Stories
        </Link>
      </Localized>
      <Localized id="general-navigation-configure">
        <Link
          to="/admin/configure"
          className={styles.link}
          activeClassName={styles.active}
        >
          Configure
        </Link>
      </Localized>
    </Flex>
    <Flex alignItems="center">
      <SignOutButtonContainer />
    </Flex>
  </Flex>
);

export default Navigation;
