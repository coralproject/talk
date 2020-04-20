import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { Flex } from "coral-ui/components/v2";

import CommentActivity from "./CommentActivity";
import NewCommenterActivity from "./NewCommenterActivity";
import TodayTotals from "./TodayTotals";
import TopStories from "./TopStories";
import CommentStatuses from "./CommentStatuses";

interface Props {
  multisite: boolean;
}

const Dashboard: FunctionComponent<Props> = props => (
  <MainLayout data-testid="dashboard-container">
    <Flex justifyContent="space-between">
      <TodayTotals />
      <CommentStatuses />
      <TopStories />
    </Flex>
    <CommentActivity />
    <NewCommenterActivity />
  </MainLayout>
);

export default Dashboard;
