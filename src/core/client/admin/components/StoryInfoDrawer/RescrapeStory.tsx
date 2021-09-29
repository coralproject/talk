import { Localized } from "@fluent/react/compat";
import RescrapeStoryMutation from "coral-admin/routes/Stories/StoryActions/RescrapeStoryMutation";
import { useMutation } from "coral-framework/lib/relay";
import { Button } from "coral-ui/components/v2";
import React, { FunctionComponent, useCallback, useState } from "react";

import styles from "./RescrapeStory.css";

export interface Props {
  storyID: string;
}

const ScrapeStory: FunctionComponent<Props> = ({ storyID }) => {
  const [triggered, setTriggered] = useState(false);
  const triggerRescrape = useMutation(RescrapeStoryMutation);
  const rescrape = useCallback(async () => {
    if (triggered) {
      return;
    }

    await triggerRescrape({ id: storyID });
    setTriggered(true);
  }, [storyID, triggerRescrape, triggered]);

  return (
    <Button
      className={styles.button}
      type="button"
      onClick={rescrape}
      variant="outlined"
      color="mono"
    >
      {triggered ? (
        <Localized id="storyInfoDrawer-rescrapeTriggered">Triggered</Localized>
      ) : (
        <Localized id="storyInfoDrawer-triggerRescrape">Rescrape</Localized>
      )}
    </Button>
  );
};

export default ScrapeStory;
