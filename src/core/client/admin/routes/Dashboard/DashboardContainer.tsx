import React, { FunctionComponent } from "react";

import Dashboard from "./Dashboard";

interface Props {
  siteID: string;
}

const DashboardContainer: FunctionComponent<Props> = ({ siteID }) => {
  return <Dashboard siteID={siteID} />;
};

export default DashboardContainer;
