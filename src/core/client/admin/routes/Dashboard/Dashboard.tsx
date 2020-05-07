import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";

import { CommentActivity, SignupActivity, Today, TopStories } from "./sections";

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
    <TopStories siteID={props.siteID} />
    <CommentActivity siteID={props.siteID} />
    {!props.ssoRegistrationEnabled && <SignupActivity siteID={props.siteID} />}
  </HorizontalGutter>
);

export default Dashboard;
