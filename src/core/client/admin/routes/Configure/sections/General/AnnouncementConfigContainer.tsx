import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { AnnouncementConfigContainer_settings as SettingsData } from "coral-admin/__generated__/AnnouncementConfigContainer_settings.graphql";
import AnnouncementConfig from "./AnnouncementConfig";

interface Props {
  settings: SettingsData;
  disabled: boolean;
}

const AnnouncementConfigContainer: FunctionComponent<Props> = ({
  settings,
  disabled,
}) => {
  return (
    <>
      <AnnouncementConfig settings={settings} />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AnnouncementConfigContainer_settings on Settings {
      announcement {
        content
        disableAt
      }
    }
  `,
})(AnnouncementConfigContainer);

export default enhanced;
