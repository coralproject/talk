import React, { FunctionComponent, useCallback, useState } from "react";

import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";

import { QAConfigContainer_story } from "coral-stream/__generated__/QAConfigContainer_story.graphql";

import DisableQA from "./DisableQA";
import DisableQAMutation from "./DisableQAMutation";
import EnableQA from "./EnableQA";
import EnableQAMutation from "./EnableQAMutation";
import ExpertSelectionQuery from "./ExpertSelectionQuery";

interface Props {
  story: QAConfigContainer_story;
}

const QAConfigContainer: FunctionComponent<Props> = ({ story }) => {
  const [waiting, setWaiting] = useState(false);
  const enableQA = useMutation(EnableQAMutation);
  const disableQA = useMutation(DisableQAMutation);

  const handleOnClick = useCallback(async () => {
    if (!waiting) {
      setWaiting(true);
      if (story.settings.mode === "COMMENTS") {
        enableQA({ storyID: story.id });
      } else {
        disableQA({ storyID: story.id });
      }
      setWaiting(false);
    }
  }, [waiting, setWaiting, story, disableQA, enableQA]);

  return story.settings.mode === "QA" ? (
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
