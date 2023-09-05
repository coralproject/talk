import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SuccessContainer_settings } from "coral-admin/__generated__/SuccessContainer_settings.graphql";

import Success from "./Success";

interface Props {
  settings: SuccessContainer_settings;
  token: string;
}

const SuccessContainer: FunctionComponent<Props> = ({ token, settings }) => {
  return (
    <Success
      token={token}
      organizationName={settings.organization.name}
      organizationURL={settings.organization.url}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment SuccessContainer_settings on Settings {
      organization {
        name
        url
      }
    }
  `,
})(SuccessContainer);

export default enhanced;
