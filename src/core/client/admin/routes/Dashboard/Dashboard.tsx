import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";

import CommentActivity from "./CommentActivity";
import CommenterActivity from "./CommenterActivity";
import TodayTotals from "./TodayTotals";
import TopStories from "./TopStories";

// interface Props {}

const Dashboard: FunctionComponent = props => (
  <MainLayout data-testid="dashboard-container">
    <h2>Dashboard</h2>
    <TodayTotals />
    <TopStories />
    <CommentActivity />
    <CommenterActivity />
  </MainLayout>
);

export default Dashboard;
