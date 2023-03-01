import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import RecacheStoryMutation from "coral-admin/components/StoryInfoDrawer/RecacheStoryMutation";
import { useFetch, useMutation } from "coral-framework/lib/relay";
import { Button, Flex } from "coral-ui/components/v2";

import FetchStoryCached from "./FetchStoryCached";

export interface Props {
  storyID: string;
}

const resetTimeMS = 3000;
const checkCachedPollTimeMS = 2000;

const CacheStoryAction: FunctionComponent<Props> = ({ storyID }) => {
  const fetchStory = useFetch(FetchStoryCached);
  const [triggered, setTriggered] = useState(false);
  const [cached, setCached] = useState(false);
  const recacheStory = useMutation(RecacheStoryMutation);

  const reset = useCallback(async () => {
    setTriggered(false);
    setCached(false);
  }, [setTriggered, setCached]);

  const checkIfCached = useCallback(async () => {
    const { story } = await fetchStory({ storyID });
    if (!story?.cached) {
      setTimeout(checkIfCached, checkCachedPollTimeMS);
    } else {
      setTriggered(false);
      setCached(true);

      setTimeout(reset, resetTimeMS);
    }
  }, [storyID, fetchStory, setCached]);

  const onRecache = useCallback(async () => {
    if (triggered || cached) {
      return;
    }

    await recacheStory({ id: storyID });
    setTriggered(true);
    setCached(false);

    setTimeout(checkIfCached, checkCachedPollTimeMS);
  }, [storyID, recacheStory, triggered]);

  return (
    <Flex>
      <Button
        disabled={triggered || cached}
        type="button"
        onClick={onRecache}
        variant="outlined"
        color="mono"
      >
        {!cached && !triggered && (
          <Localized id="storyInfoDrawer-cacheStory-recache">
            Recache story
          </Localized>
        )}
        {!cached && triggered && (
          <Localized id="storyInfoDrawer-cacheStory-recaching">
            Recaching
          </Localized>
        )}
        {cached && !triggered && (
          <Localized id="storyInfoDrawer-cacheStory-cached">Cached</Localized>
        )}
      </Button>
    </Flex>
  );
};

export default CacheStoryAction;
