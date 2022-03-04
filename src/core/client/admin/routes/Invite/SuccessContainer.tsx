import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { SuccessContainer_settings$key as SuccessContainer_settings } from "coral-admin/__generated__/SuccessContainer_settings.graphql";

import Success from "./Success";

interface Props {
  settings: SuccessContainer_settings;
  token: string;
}

const SuccessContainer: FunctionComponent<Props> = ({ token, settings }) => {
  const settingsData = useFragment(
    graphql`
      fragment SuccessContainer_settings on Settings {
        organization {
          name
          url
        }
      }
    `,
    settings
  );

  return (
    <Success
      token={token}
      organizationName={settingsData.organization.name}
      organizationURL={settingsData.organization.url}
    />
  );
};

export default SuccessContainer;
