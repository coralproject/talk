import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { Flex } from "coral-ui/components/v2";

import CommentActivity from "./CommentActivity";
import CommentStatuses from "./CommentStatuses";
import NewCommenterActivity from "./NewCommenterActivity";
import TodayTotals from "./TodayTotals";
import TopStories from "./TopStories";

interface Props {
  multisite: boolean;
  ssoRegistrationEnabled: boolean;
}

const Dashboard: FunctionComponent<Props> = props => (
  <MainLayout data-testid="dashboard-container">
    <Flex justifyContent="space-between">
      <TodayTotals ssoRegistrationEnabled={props.ssoRegistrationEnabled} />
      <CommentStatuses />
      <TopStories />
    </Flex>
    <CommentActivity />
    <NewCommenterActivity />
  </MainLayout>
);

export default Dashboard;
