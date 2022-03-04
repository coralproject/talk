import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { InviteCompleteFormContainer_settings$key as InviteCompleteFormContainer_settings } from "coral-admin/__generated__/InviteCompleteFormContainer_settings.graphql";

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
  const settingsData = useFragment(
    graphql`
      fragment InviteCompleteFormContainer_settings on Settings {
        organization {
          name
        }
      }
    `,
    settings
  );

  return (
    <InviteCompleteForm
      token={token}
      organizationName={settingsData.organization.name}
      onSuccess={onSuccess}
    />
  );
};

export default InviteCompleteFormContainer;
