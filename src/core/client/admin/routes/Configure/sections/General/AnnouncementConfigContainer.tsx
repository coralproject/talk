import React, { FunctionComponent } from "react";

import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";

import { AnnouncementConfigContainer_settings as SettingsData } from "coral-admin/__generated__/AnnouncementConfigContainer_settings.graphql";

import AnnouncementConfig from "./AnnouncementConfig";
import CreateAnnouncementMutaiton from "./CreateAnnouncementMutation";
import DeleteAnnouncementMutaiton from "./DeleteAnnouncementMutation";

interface Props {
  settings: SettingsData;
  disabled: boolean;
}

const AnnouncementConfigContainer: FunctionComponent<Props> = ({
  settings,
  disabled,
}) => {
  const createAnnouncement = useMutation(CreateAnnouncementMutaiton);
  const deleteAnnouncement = useMutation(DeleteAnnouncementMutaiton);
  return (
    <>
      <AnnouncementConfig
        settings={settings}
        createAnnouncement={createAnnouncement}
        deleteAnnouncement={deleteAnnouncement}
      />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AnnouncementConfigContainer_settings on Settings {
      announcement {
        content
        duration
        createdAt
      }
    }
  `,
})(AnnouncementConfigContainer);

export default enhanced;
