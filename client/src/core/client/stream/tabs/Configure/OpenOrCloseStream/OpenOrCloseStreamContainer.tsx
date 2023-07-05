import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { OpenOrCloseStreamContainer_story as StoryData } from "coral-stream/__generated__/OpenOrCloseStreamContainer_story.graphql";

import {
  CloseStoryMutation,
  withCloseStoryMutation,
} from "./CloseStoryMutation";
import CloseStream from "./CloseStream";
import { OpenStoryMutation, withOpenStoryMutation } from "./OpenStoryMutation";
import OpenStream from "./OpenStream";

import styles from "./OpenOrCloseStreamContainer.css";

interface Props {
  story: StoryData;
  openStory: OpenStoryMutation;
  closeStory: CloseStoryMutation;
}

const OpenOrCloseStreamContainer: FunctionComponent<Props> = ({
  story,
  openStory,
  closeStory,
}) => {
  const [waiting, setWaiting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onClick = useCallback(async () => {
    if (!waiting) {
      setWaiting(true);
      if (story.isClosed) {
        await openStory({ id: story.id });
      } else {
        await closeStory({ id: story.id });
      }
      setWaiting(false);
      setShowSuccess(true);
    }
  }, [waiting, setWaiting, story, openStory, closeStory, setShowSuccess]);
  const onCloseSuccess = useCallback(() => {
    setShowSuccess(false);
  }, [setShowSuccess]);

  return story.isClosed ? (
    <section aria-labelledby="configure-openStream-title">
      <OpenStream onClick={onClick} disableButton={waiting} />
      <div
        className={showSuccess ? styles.calloutVisible : styles.calloutHidden}
      >
        {showSuccess && (
          <CallOut
            color="success"
            icon={<Icon size="sm">check_circle</Icon>}
            title={
              <Localized id="configure-openStream-theStreamIsNowClosed">
                The stream is now closed
              </Localized>
            }
            onClose={onCloseSuccess}
            visible={showSuccess}
            aria-live="polite"
          />
        )}
      </div>
    </section>
  ) : (
    <section aria-labelledby="configure-closeStream-title">
      <CloseStream onClick={onClick} disableButton={waiting} />
      <div
        className={showSuccess ? styles.calloutVisible : styles.calloutHidden}
      >
        {showSuccess && (
          <CallOut
            color="success"
            icon={<Icon size="sm">check_circle</Icon>}
            title={
              <Localized id="configure-closeStream-theStreamIsNowOpen">
                The stream is now open
              </Localized>
            }
            onClose={onCloseSuccess}
            visible={showSuccess}
            aria-live="polite"
          />
        )}
      </div>
    </section>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment OpenOrCloseStreamContainer_story on Story {
      id
      isClosed
    }
  `,
})(withOpenStoryMutation(withCloseStoryMutation(OpenOrCloseStreamContainer)));
export default enhanced;
