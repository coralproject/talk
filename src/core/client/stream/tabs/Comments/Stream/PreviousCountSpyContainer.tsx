import { FunctionComponent, useEffect } from "react";
import { graphql } from "react-relay";

import getPreviousCountStorageKey from "coral-framework/helpers/getPreviousCountStorageKey";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

import { PreviousCountSpyContainer_settings } from "coral-stream/__generated__/PreviousCountSpyContainer_settings.graphql";
import { PreviousCountSpyContainer_story } from "coral-stream/__generated__/PreviousCountSpyContainer_story.graphql";

interface Props {
  story: PreviousCountSpyContainer_story;
  settings: PreviousCountSpyContainer_settings;
}

const PreviousCountSpyContainer: FunctionComponent<Props> = ({
  story,
  settings: { featureFlags },
}) => {
  const { localStorage } = useCoralContext();

  // Whenever the all comments count changes, update the value in local storage.
  useEffect(() => {
    // If the feature is not enabled, then do nothing!
    if (!featureFlags.includes(GQLFEATURE_FLAG.NEW_COMMENT_COUNT)) {
      return;
    }

    // key is the key used to store the count in storage.
    const key = getPreviousCountStorageKey(story.id);

    /**
     * remove will remove the item from localStorage.
     */
    async function remove() {
      try {
        // Remove the published count from localStorage.
        await localStorage.removeItem(key);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    // If the story is closed, then we can't have new comments, so remove the
    // entry!
    if (story.isClosed) {
      void remove();
      return;
    }

    // value is the current comment count as a string to be stored in storage.
    const value = story.commentCounts.totalPublished.toString();

    /**
     * update will take the current published comment count and update it in
     * storage.
     */
    async function update() {
      try {
        // Set the published count in localStorage.
        await localStorage.setItem(key, value);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    void update();
  }, [
    featureFlags,
    localStorage,
    story.commentCounts.totalPublished,
    story.id,
    story.isClosed,
  ]);

  return null;
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment PreviousCountSpyContainer_story on Story {
      id
      isClosed
      commentCounts {
        totalPublished
      }
    }
  `,
  settings: graphql`
    fragment PreviousCountSpyContainer_settings on Settings {
      featureFlags
    }
  `,
})(PreviousCountSpyContainer);

export default enhanced;
