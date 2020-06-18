import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import { ANNOUNEMENT_DISMISSED_KEY } from "coral-framework/constants";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { AnnouncementContainer_settings as SettingsData } from "coral-stream/__generated__/AnnouncementContainer_settings.graphql";

import Announcement from "./Announcement";

interface Props {
  settings: SettingsData;
}

export const AnnouncementContainer: FunctionComponent<Props> = ({
  settings,
}) => {
  const { localStorage } = useCoralContext();
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    async function getDismissedStatus() {
      if (settings.announcement) {
        const key = await localStorage.getItem(ANNOUNEMENT_DISMISSED_KEY);
        if (key && key === settings.announcement.id) {
          setDismissed(true);
        }
      }
    }
    void getDismissedStatus();
  }, [settings]);
  const dismissAnnouncement = useCallback(async () => {
    if (settings.announcement) {
      await localStorage.setItem(
        ANNOUNEMENT_DISMISSED_KEY,
        settings.announcement.id
      );
      setDismissed(true);
    }
  }, [settings]);
  if (!settings.announcement || dismissed) {
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
