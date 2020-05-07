import React, { FunctionComponent } from "react";

import { Flex, HorizontalGutter } from "coral-ui/components/v2";

import { CommentActivity, SignupActivity, Today, TopStories } from "./sections";

import styles from "./Dashboard.css";

interface Props {
  ssoRegistrationEnabled: boolean;
  siteID?: string;
}

const Dashboard: FunctionComponent<Props> = (props) => (
  <HorizontalGutter spacing={6}>
    <Today
      ssoRegistrationEnabled={props.ssoRegistrationEnabled}
      siteID={props.siteID}
    />
    <Flex spacing={5}>
      <HorizontalGutter className={styles.columns}>
        <CommentActivity siteID={props.siteID} />
        {!props.ssoRegistrationEnabled && (
          <SignupActivity siteID={props.siteID} />
        )}
      </HorizontalGutter>
      <div className={styles.columns}>
        <TopStories siteID={props.siteID} />
      </div>
    </Flex>
  </HorizontalGutter>
);

export default Dashboard;
