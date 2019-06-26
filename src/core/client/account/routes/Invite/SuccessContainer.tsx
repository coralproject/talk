import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import React, { FunctionComponent } from "react";

import { SuccessContainer_settings } from "coral-account/__generated__/SuccessContainer_settings.graphql";

import Success from "./Success";

interface Props {
  settings: SuccessContainer_settings;
  token: string;
}

const SuccessContainer: FunctionComponent<Props> = ({ token, settings }) => {
  return (
    <Success token={token} organizationName={settings.organization.name} />
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment SuccessContainer_settings on Settings {
      organization {
        name
      }
    }
  `,
})(SuccessContainer);

export default enhanced;
