import { Localized } from "@fluent/react/compat";
import RescrapeStoryMutation from "coral-admin/routes/Stories/StoryActions/RescrapeStoryMutation";
import { useMutation } from "coral-framework/lib/relay";
import { Button, Flex } from "coral-ui/components/v2";
import React, { FunctionComponent, useCallback, useState } from "react";

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
    <Flex>
      <Button
        disabled={triggered}
        type="button"
        onClick={rescrape}
        variant="outlined"
        color="mono"
      >
        {triggered ? (
          <Localized id="storyInfoDrawer-rescrapeTriggered">
            Triggered
          </Localized>
        ) : (
          <Localized id="storyInfoDrawer-triggerRescrape">Rescrape</Localized>
        )}
      </Button>
    </Flex>
  );
};

export default ScrapeStory;
