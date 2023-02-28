import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import InvalidateCachedStoryMutation from "coral-admin/components/StoryInfoDrawer/InvalidateCachedStoryMutation";
import { useMutation } from "coral-framework/lib/relay";
import { Button, Flex } from "coral-ui/components/v2";

export interface Props {
  storyID: string;
}

const InvalidateCachedStoryAction: FunctionComponent<Props> = ({ storyID }) => {
  const [triggered, setTriggered] = useState(false);
  const invalidateStory = useMutation(InvalidateCachedStoryMutation);
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
