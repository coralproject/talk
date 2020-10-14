import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex, Typography } from "coral-ui/components/v2";

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
        className={cn(styles.headline, { [styles.headlineMain]: main })}
        variant="heading2"
      >
        Coral by Vox Media
      </Typography>
      <Localized id="install-header-title">
        <Typography
          className={cn({ [styles.subHeadlineMain]: main })}
          variant="heading1"
        >
          Coral Installation Wizard
        </Typography>
      </Localized>
    </Flex>
  );
};

export default Header;
