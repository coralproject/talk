import React, { FunctionComponent, useCallback, useState } from "react";

import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG, GQLSTORY_MODE } from "coral-framework/schema";

import { QAConfigContainer_settings } from "coral-stream/__generated__/QAConfigContainer_settings.graphql";
import { QAConfigContainer_story } from "coral-stream/__generated__/QAConfigContainer_story.graphql";

import HorizontalRule from "../HorizontalRule";
import DisableQA from "./DisableQA";
import EnableQA from "./EnableQA";
import ExpertSelectionQuery from "./ExpertSelectionQuery";
import UpdateStoryModeMutation from "./UpdateStoryModeMutation";

interface Props {
  story: QAConfigContainer_story;
  settings: QAConfigContainer_settings;
}

const QAConfigContainer: FunctionComponent<Props> = ({ story, settings }) => {
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

  // Check if we're allowed to show Q&A based on feature flags
  if (!settings.featureFlags.includes(GQLFEATURE_FLAG.ENABLE_QA)) {
    return null;
  }

  return isQA ? (
    <>
      <HorizontalRule />
      <DisableQA onClick={handleOnClick} disableButton={waiting} />
      <ExpertSelectionQuery storyID={story.id} />
    </>
  ) : (
    <>
      <HorizontalRule />
      <EnableQA onClick={handleOnClick} disableButton={waiting} />
    </>
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
  settings: graphql`
    fragment QAConfigContainer_settings on Settings {
      featureFlags
    }
  `,
})(QAConfigContainer);
export default enhanced;
