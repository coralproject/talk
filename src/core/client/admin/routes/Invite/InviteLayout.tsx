import React, { FunctionComponent } from "react";

import Version from "coral-admin/App/Version";
import { AppBar, Flex, LogoHorizontal } from "coral-ui/components/v2";
import { Begin } from "coral-ui/components/v2/AppBar";

import styles from "./InviteLayout.css";

const InviteLayout: FunctionComponent = ({ children }) => (
  <div className={styles.root} data-testid="invite-complete-container">
    <AppBar gutterBegin gutterEnd>
      <Begin itemGutter="double">
        <div className={styles.logoContainer}>
          <LogoHorizontal />
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
    <Version />
  </div>
);

export default InviteLayout;
