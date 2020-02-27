import React, { FunctionComponent, useCallback, useState } from "react";

import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSTORY_MODE } from "coral-framework/schema";

import { QAConfigContainer_story } from "coral-stream/__generated__/QAConfigContainer_story.graphql";

import DisableQA from "./DisableQA";
import EnableQA from "./EnableQA";
import ExpertSelectionQuery from "./ExpertSelectionQuery";
import UpdateStoryModeMutation from "./UpdateStoryModeMutation";

interface Props {
  story: QAConfigContainer_story;
}

const QAConfigContainer: FunctionComponent<Props> = ({ story }) => {
  const [waiting, setWaiting] = useState(false);
  const updateStoryMode = useMutation(UpdateStoryModeMutation);

  const handleOnClick = useCallback(async () => {
    if (!waiting) {
      setWaiting(true);
      if (story.settings.mode === GQLSTORY_MODE.COMMENTS) {
        updateStoryMode({ storyID: story.id, mode: GQLSTORY_MODE.QA });
      } else {
        updateStoryMode({ storyID: story.id, mode: GQLSTORY_MODE.COMMENTS });
      }
      setWaiting(false);
    }
  }, [waiting, setWaiting, story, updateStoryMode]);

  const isQA = story.settings.mode === GQLSTORY_MODE.QA;

  return isQA ? (
    <>
      <DisableQA onClick={handleOnClick} disableButton={waiting} />
      <ExpertSelectionQuery storyID={story.id} />
    </>
  ) : (
    <EnableQA onClick={handleOnClick} disableButton={waiting} />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment QAConfigContainer_story on Story {
      id
      settings {
        mode
      }
    }
  `,
})(QAConfigContainer);
export default enhanced;
