import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import TodayTotals from "./TodayTotals";

// interface Props {}

const Dashboard: FunctionComponent = props => (
  <MainLayout data-testid="dashboard-container">
    <h2>Dashboard</h2>
    <TodayTotals />
  </MainLayout>
);

export default Dashboard;
