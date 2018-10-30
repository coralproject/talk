import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import SignOutButtonContainer from "../containers/SignOutButtonContainer";
import styles from "./Navigation.css";
import NavigationLink from "./NavigationLink";

const Navigation: StatelessComponent = () => (
  <Flex className={styles.root} justifyContent="space-between">
    <Flex alignItems="center">
      <Localized id="general-navigation-moderate">
        <NavigationLink to="/admin/moderate">Moderate</NavigationLink>
      </Localized>
      <Localized id="general-navigation-community">
        <NavigationLink to="/admin/community">Community</NavigationLink>
      </Localized>
      <Localized id="general-navigation-stories">
        <NavigationLink to="/admin/stories">Stories</NavigationLink>
      </Localized>
      <Localized id="general-navigation-configure">
        <NavigationLink to="/admin/configure">Configure</NavigationLink>
      </Localized>
    </Flex>
    <Flex alignItems="center">
      <SignOutButtonContainer />
    </Flex>
  </Flex>
);

export default Navigation;
