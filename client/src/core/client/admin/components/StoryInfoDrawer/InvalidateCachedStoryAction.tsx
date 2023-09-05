import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import InvalidateCachedStoryMutation from "coral-admin/components/StoryInfoDrawer/InvalidateCachedStoryMutation";
import { useFetch, useMutation } from "coral-framework/lib/relay";
import { Button, Flex } from "coral-ui/components/v2";

import FetchStoryCached from "./FetchStoryCached";

export interface Props {
  storyID: string;
}

const checkCachedPollTimeMS = 2000;

const InvalidateCachedStoryAction: FunctionComponent<Props> = ({ storyID }) => {
  const fetchStory = useFetch(FetchStoryCached);
  const [triggered, setTriggered] = useState(false);
  const invalidateStory = useMutation(InvalidateCachedStoryMutation);

  const checkIfCached = useCallback(async () => {
    const { story } = await fetchStory({ storyID });
    if (!story || story.cached) {
      setTimeout(checkIfCached, checkCachedPollTimeMS);
    } else if (story && !story.cached) {
      setTriggered(false);
    }
  }, [storyID, fetchStory]);

  const onInvalidateCache = useCallback(async () => {
    if (triggered) {
      return;
    }

    await invalidateStory({ id: storyID });
    setTriggered(true);
  }, [storyID, invalidateStory, triggered]);

  return (
    <Flex>
      <Button
        disabled={triggered}
        type="button"
        onClick={onInvalidateCache}
        variant="outlined"
        color="mono"
      >
        {triggered ? (
          <Localized id="storyInfoDrawer-cacheStory-uncaching">
            Uncaching
          </Localized>
        ) : (
          <Localized id="storyInfoDrawer-cacheStory-uncacheStory">
            Uncache story
          </Localized>
        )}
      </Button>
    </Flex>
  );
};

export default InvalidateCachedStoryAction;
