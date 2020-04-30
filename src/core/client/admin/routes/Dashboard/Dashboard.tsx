import React, { FunctionComponent } from "react";

import { Flex, HorizontalGutter } from "coral-ui/components/v2";

import AllTimeTotals from "./AllTimeTotals";
import CommentActivity from "./CommentActivity";
import NewCommenterActivity from "./NewCommenterActivity";
import TodayTotals from "./TodayTotals";
import TopStories from "./TopStories";

interface Props {
  ssoRegistrationEnabled: boolean;
  siteID?: string;
}

const Dashboard: FunctionComponent<Props> = (props) => (
  <HorizontalGutter spacing={6}>
    <Flex spacing={6}>
      <TodayTotals
        ssoRegistrationEnabled={props.ssoRegistrationEnabled}
        siteID={props.siteID}
      />
      <AllTimeTotals
        ssoRegistrationEnabled={props.ssoRegistrationEnabled}
        siteID={props.siteID}
      />
      <TopStories siteID={props.siteID} />
    </Flex>
    <CommentActivity siteID={props.siteID} />
    {!props.ssoRegistrationEnabled && (
      <NewCommenterActivity siteID={props.siteID} />
    )}
  </HorizontalGutter>
);

export default Dashboard;
