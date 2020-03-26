import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { InviteCompleteFormContainer_settings } from "coral-admin/__generated__/InviteCompleteFormContainer_settings.graphql";

import InviteCompleteForm from "./InviteCompleteForm";

interface Props {
  token: string;
  settings: InviteCompleteFormContainer_settings;
  disabled?: boolean;
  onSuccess: () => void;
}

const InviteCompleteFormContainer: FunctionComponent<Props> = ({
  onSuccess,
  token,
  settings,
}) => {
  return (
    <InviteCompleteForm
      token={token}
      organizationName={settings.organization.name}
      onSuccess={onSuccess}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment InviteCompleteFormContainer_settings on Settings {
      organization {
        name
      }
    }
  `,
})(InviteCompleteFormContainer);

export default enhanced;
