import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Typography } from "coral-ui/components";

import styles from "./Header.css";

interface HeaderProps {
  main?: boolean;
}

const Header: FunctionComponent<HeaderProps> = ({ main }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column"
      className={styles.root}
    >
      <Typography
        className={cn(styles.headline, {
          [styles.headlineMain]: main,
        })}
      >
        The Coral Project
      </Typography>
      <Localized id="install-header-title">
        <Typography
          className={cn(styles.subHeadline, {
            [styles.subHeadlineMain]: main,
          })}
          variant="heading1"
        >
          Coral Installation Wizard
        </Typography>
      </Localized>
    </Flex>
  );
};

export default Header;
