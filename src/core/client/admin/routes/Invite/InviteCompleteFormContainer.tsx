import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { InviteCompleteFormContainer_site } from "coral-admin/__generated__/InviteCompleteFormContainer_site.graphql";

import InviteCompleteForm from "./InviteCompleteForm";

interface Props {
  token: string;
  site: InviteCompleteFormContainer_site;
  disabled?: boolean;
  onSuccess: () => void;
}

const InviteCompleteFormContainer: FunctionComponent<Props> = ({
  onSuccess,
  token,
  site,
}) => {
  return (
    <InviteCompleteForm
      token={token}
      organizationName={site.organization.name}
      onSuccess={onSuccess}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment InviteCompleteFormContainer_site on Site {
      name
    }
  `,
})(InviteCompleteFormContainer);

export default enhanced;
