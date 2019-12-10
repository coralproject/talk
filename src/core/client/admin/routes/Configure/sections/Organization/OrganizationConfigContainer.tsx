import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components";

import { OrganizationConfigContainer_organization as OrganizationData } from "coral-admin/__generated__/OrganizationConfigContainer_organization.graphql";

import OrganizationNameConfig from "./OrganizationNameConfig";

interface Props {
  submitting: boolean;
  organization: OrganizationData;
}
const OrganizationConfigContainer: React.FunctionComponent<Props> = ({
  submitting,
  organization,
}) => {
  const form = useForm();
  useMemo(() => form.initialize(purgeMetadata(organization)), []);
  return (
    <HorizontalGutter
      size="double"
      data-testid="configure-organizationContainer"
    >
      <OrganizationNameConfig disabled={submitting} />
    </HorizontalGutter>
  );
};
const enhanced = withFragmentContainer<Props>({
  organization: graphql`
    fragment OrganizationConfigContainer_organization on Organization {
      ...OrganizationNameConfig_formValues @relay(mask: false)
      ...OrganizationNameConfig_formValues @relay(mask: false)
    }
  `,
})(OrganizationConfigContainer);
export default enhanced;
