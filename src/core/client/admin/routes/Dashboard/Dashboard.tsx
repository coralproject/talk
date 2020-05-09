import React, { FunctionComponent } from "react";

import { Flex, HorizontalGutter } from "coral-ui/components/v2";

import { CommentActivity, SignupActivity, Today, TopStories } from "./sections";

import styles from "./Dashboard.css";

interface Props {
  siteID: string;
}

const Dashboard: FunctionComponent<Props> = (props) => (
  <HorizontalGutter spacing={6}>
    <Today siteID={props.siteID} />
    <Flex spacing={5}>
      <HorizontalGutter className={styles.columns}>
        <CommentActivity siteID={props.siteID} />
        <SignupActivity siteID={props.siteID} />
      </HorizontalGutter>
      <div className={styles.columns}>
        <TopStories siteID={props.siteID} />
      </div>
    </Flex>
  </HorizontalGutter>
);

export default Dashboard;
