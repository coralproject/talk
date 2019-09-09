import React, { FunctionComponent } from "react";

import Version from "coral-admin/App/Version";
import { AppBar, Flex, LogoHorizontal } from "coral-ui/components";
import { Begin } from "coral-ui/components/AppBar";

import styles from "./InviteLayout.css";

const InviteLayout: FunctionComponent = ({ children }) => (
  <div className={styles.root} data-testid="invite-complete-container">
    <AppBar gutterBegin gutterEnd>
      <Begin itemGutter="double">
        <div className={styles.logoContainer}>
          <LogoHorizontal />
          <Version />
        </div>
      </Begin>
    </AppBar>
    <Flex
      margin={8}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Flex>
  </div>
);

export default InviteLayout;
