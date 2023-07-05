import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";

import { OrganizationConfigContainer_settings as SettingsData } from "coral-admin/__generated__/OrganizationConfigContainer_settings.graphql";

import OrganizationContactEmailConfig from "./OrganizationContactEmailConfig";
import OrganizationNameConfig from "./OrganizationNameConfig";
import OrganizationURLConfig from "./OrganizationURLConfig";

interface Props {
  submitting: boolean;
  settings: SettingsData;
}
const OrganizationConfigContainer: React.FunctionComponent<Props> = ({
  settings,
  submitting,
}) => {
  const form = useForm();
  useMemo(() => form.initialize(purgeMetadata(settings)), []);
  return (
    <>
      <OrganizationNameConfig disabled={submitting} />
      <OrganizationURLConfig disabled={submitting} />
      <OrganizationContactEmailConfig disabled={submitting} />
    </>
  );
};
const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment OrganizationConfigContainer_settings on Settings {
      ...OrganizationNameConfig_formValues @relay(mask: false)
      ...OrganizationURLConfig_formValues @relay(mask: false)
      ...OrganizationContactEmailConfig_formValues @relay(mask: false)
    }
  `,
})(OrganizationConfigContainer);
export default enhanced;
