import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";

import { OrganizationConfigContainer_settings as SettingsData } from "coral-admin/__generated__/OrganizationConfigContainer_settings.graphql";

import OrganizationNameConfig from "./OrganizationNameConfig";

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
  return <OrganizationNameConfig disabled={submitting} />;
};
const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment OrganizationConfigContainer_settings on Settings {
      ...OrganizationNameConfig_formValues @relay(mask: false)
    }
  `,
})(OrganizationConfigContainer);
export default enhanced;
