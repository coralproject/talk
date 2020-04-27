import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { Flex } from "coral-ui/components/v2";

import CommentActivity from "./CommentActivity";
import NewCommenterActivity from "./NewCommenterActivity";
import TodayTotals from "./TodayTotals";
import TopStories from "./TopStories";

import styles from "./Dashboard.css";

interface Props {
  ssoRegistrationEnabled: boolean;
  siteID?: string;
}

const Dashboard: FunctionComponent<Props> = (props) => (
  <MainLayout data-testid="dashboard-container">
    <div className={styles.root}>
      <Flex justifyContent="space-between">
        <TodayTotals
          ssoRegistrationEnabled={props.ssoRegistrationEnabled}
          siteID={props.siteID}
        />
      </Flex>
      <TopStories siteID={props.siteID} />
      <CommentActivity siteID={props.siteID} />

      {!props.ssoRegistrationEnabled && (
        <NewCommenterActivity siteID={props.siteID} />
      )}
    </div>
  </MainLayout>
);

export default Dashboard;
