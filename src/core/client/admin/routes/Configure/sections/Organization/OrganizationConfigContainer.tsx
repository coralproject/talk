import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql, useFragment } from "react-relay";

import { purgeMetadata } from "coral-framework/lib/relay";

import { OrganizationConfigContainer_settings$key as SettingsData } from "coral-admin/__generated__/OrganizationConfigContainer_settings.graphql";

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
  const settingsData = useFragment(
    graphql`
      fragment OrganizationConfigContainer_settings on Settings {
        ...OrganizationNameConfig_formValues @relay(mask: false)
        ...OrganizationURLConfig_formValues @relay(mask: false)
        ...OrganizationContactEmailConfig_formValues @relay(mask: false)
      }
    `,
    settings
  );

  const form = useForm();
  useMemo(() => form.initialize(purgeMetadata(settingsData)), [
    form,
    settingsData,
  ]);
  return (
    <>
      <OrganizationNameConfig disabled={submitting} />
      <OrganizationURLConfig disabled={submitting} />
      <OrganizationContactEmailConfig disabled={submitting} />
    </>
  );
};

export default OrganizationConfigContainer;
