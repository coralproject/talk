/* eslint-disable */
import React, { FunctionComponent, useCallback, useState } from "react";
import { Button } from "coral-ui/components/v2";
import RescrapeStoryMutation from "coral-admin/routes/Stories/StoryActions/RescrapeStoryMutation";
import { useMutation } from "coral-framework/lib/relay";

import styles from "./RescrapeStory.css";

export interface Props {
  storyID: string;
}

const ScrapeStory: FunctionComponent<Props> = ({ storyID }) => {
  const [triggered, setTriggered] = useState(false);
  const triggerRescrape = useMutation(RescrapeStoryMutation);
  const rescrape = useCallback(
    async () => {
      if (triggered) {
        return;
      }

      await triggerRescrape({ id: storyID });
      setTriggered(true);
    },
    [storyID],
  )
  return (
    // TODO (marcushaddon): localize/capitalize
    <Button
      className={styles.button}
      type="button" // TODO: actually just restyle
      onClick={rescrape}
    >
      {triggered ? "RESCRAPE TRIGGERED" : "RESCRAPE"}
    </Button>
  );
};

export default ScrapeStory;
