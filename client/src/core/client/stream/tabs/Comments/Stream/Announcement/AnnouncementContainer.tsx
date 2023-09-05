import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import { ANNOUNCEMENT_DISMISSED_KEY } from "coral-framework/constants";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { AnnouncementContainer_settings as SettingsData } from "coral-stream/__generated__/AnnouncementContainer_settings.graphql";

import Announcement from "./Announcement";

interface Props {
  settings: SettingsData;
}

export const AnnouncementContainer: FunctionComponent<Props> = ({
  settings: { announcement },
}) => {
  const { localStorage } = useCoralContext();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!announcement) {
      return;
    }

    async function getDismissedStatus(id: string) {
      const key = await localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY);
      if (key && key === id) {
        setDismissed(true);
      }
    }

    void getDismissedStatus(announcement.id);
  }, [announcement, localStorage]);

  const dismissAnnouncement = useCallback(async () => {
    if (!announcement) {
      return;
    }

    await localStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, announcement.id);
    setDismissed(true);
  }, [announcement, localStorage]);

  if (!announcement || dismissed) {
    return null;
  }
  return (
    <Announcement onClose={dismissAnnouncement}>
      {announcement.content}
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
