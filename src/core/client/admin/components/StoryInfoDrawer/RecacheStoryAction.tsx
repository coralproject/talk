import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import RecacheStoryMutation from "coral-admin/components/StoryInfoDrawer/RecacheStoryMutation";
import { useMutation } from "coral-framework/lib/relay";
import { Button, Flex } from "coral-ui/components/v2";

export interface Props {
  storyID: string;
}

const CacheStoryAction: FunctionComponent<Props> = ({ storyID }) => {
  const [triggered, setTriggered] = useState(false);
  const recacheStory = useMutation(RecacheStoryMutation);
  const onRecache = useCallback(async () => {
    if (triggered) {
      return;
    }

    await recacheStory({ id: storyID });
    setTriggered(true);
  }, [storyID, recacheStory, triggered]);

  return (
    <Flex>
      <Button
        disabled={triggered}
        type="button"
        onClick={onRecache}
        variant="outlined"
        color="mono"
      >
        {triggered ? (
          <Localized id="storyInfoDrawer-cacheStory-recaching">
            Recaching
          </Localized>
        ) : (
          <Localized id="storyInfoDrawer-cacheStory-recache">
            Recache story
          </Localized>
        )}
      </Button>
    </Flex>
  );
};

export default CacheStoryAction;
