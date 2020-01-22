import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { ANNOUNEMENT_DISMISSED_KEY } from "coral-framework/constants";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { useLocalStorage } from "coral-ui/hooks";

import { AnnouncementContainer_settings as SettingsData } from "coral-stream/__generated__/AnnouncementContainer_settings.graphql";

import Announcement from "./Announcement";

interface Props {
  settings: SettingsData;
}

export const AnnouncementContainer: FunctionComponent<Props> = ({
  settings,
}) => {
  const [value, setValue] = useLocalStorage(ANNOUNEMENT_DISMISSED_KEY);
  const dismissAnnouncement = useCallback(() => {
    if (settings.announcement) {
      setValue(settings.announcement.id);
    }
  }, [settings]);
  if (!settings.announcement) {
    return null;
  }
  if (value && value === settings.announcement.id) {
    return null;
  }
  return (
    <Announcement onClose={dismissAnnouncement}>
      {settings.announcement.content}
    </Announcement>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AnnouncementContainer_settings on Settings {
      announcement {
        id
        content
      }
    }
  `,
})(AnnouncementContainer);

export default enhanced;
