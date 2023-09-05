import React, { FunctionComponent } from "react";

import { Flex, HorizontalGutter } from "coral-ui/components/v2";

import { CommentActivity, SignupActivity, Today, TopStories } from "./sections";

import styles from "./Dashboard.css";

interface Props {
  siteID: string;
  lastUpdated: string;
}

const Dashboard: FunctionComponent<Props> = (props) => (
  <HorizontalGutter spacing={4}>
    <Today siteID={props.siteID} lastUpdated={props.lastUpdated} />
    <Flex spacing={5}>
      <HorizontalGutter className={styles.columns} spacing={4}>
        <CommentActivity
          siteID={props.siteID}
          lastUpdated={props.lastUpdated}
        />
        <SignupActivity siteID={props.siteID} lastUpdated={props.lastUpdated} />
      </HorizontalGutter>
      <div className={styles.columns}>
        <TopStories siteID={props.siteID} lastUpdated={props.lastUpdated} />
      </div>
    </Flex>
  </HorizontalGutter>
);

export default Dashboard;
