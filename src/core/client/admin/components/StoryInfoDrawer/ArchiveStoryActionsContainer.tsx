import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "relay-runtime";

import { Ability, can } from "coral-admin/permissions/story";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSTORY_MODE, GQLSTORY_STATUS } from "coral-framework/schema";
import { Button } from "coral-ui/components/v3";

import { ArchiveStoryActionsContainer_local } from "coral-admin/__generated__/ArchiveStoryActionsContainer_local.graphql";
import { ArchiveStoryActionsContainer_story } from "coral-admin/__generated__/ArchiveStoryActionsContainer_story.graphql";
import { ArchiveStoryActionsContainer_viewer } from "coral-admin/__generated__/ArchiveStoryActionsContainer_viewer.graphql";

import ArchiveStoriesMutation from "./ArchiveStoriesMutation";
import UnarchiveStoriesMutation from "./UnarchiveStoriesMutation";

import styles from "./ArchiveStoryActionsContainer.css";

export interface Props {
  story: ArchiveStoryActionsContainer_story;
  viewer: ArchiveStoryActionsContainer_viewer;
}

const ArchiveStoryActionsContainer: FunctionComponent<Props> = ({
  story,
  viewer,
}) => {
  const archiveStory = useMutation(ArchiveStoriesMutation);
  const unarchiveStory = useMutation(UnarchiveStoriesMutation);

  const [{ archivingEnabled }] =
    useLocal<ArchiveStoryActionsContainer_local>(graphql`
      fragment ArchiveStoryActionsContainer_local on Local {
        archivingEnabled
      }
    `);

  const [archiveTriggered, setArchiveTriggered] = useState(false);

  const handleArchive = useCallback(() => {
    setArchiveTriggered(true);
    void archiveStory({ storyIDs: [story.id] });
  }, [story, archiveStory]);
  const handleUnarchive = useCallback(
    () => unarchiveStory({ storyIDs: [story.id] }),
    [story, unarchiveStory]
  );

  const viewCanArchive = can(viewer, Ability.ARCHIVE_STORY);

  const canArchive =
    archivingEnabled &&
    viewCanArchive &&
    !story.isArchiving &&
    !story.isArchived &&
    story.settings?.mode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS;

  const canUnarchive =
    archivingEnabled &&
    story.status === GQLSTORY_STATUS.CLOSED &&
    viewCanArchive &&
    !story.isArchiving &&
    story.isArchived;

  if (story.isUnarchiving) {
    return (
      <Localized id="stories-actions-isUnarchiving">
        <Button className={styles.button} disabled={true} color="secondary">
          Unarchiving
        </Button>
      </Localized>
    );
  }

  if (canArchive) {
    return (
      <Localized id="stories-actions-archive">
        <Button
          className={styles.button}
          disabled={archiveTriggered}
          onClick={handleArchive}
          color="error"
        >
          Archive story
        </Button>
      </Localized>
    );
  } else if (canUnarchive) {
    return (
      <Localized id="stories-actions-unarchive">
        <Button className={styles.button} onClick={handleUnarchive}>
          Unarchive story
        </Button>
      </Localized>
    );
  }

  return null;
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment ArchiveStoryActionsContainer_story on Story {
      id
      isArchiving
      isArchived
      isUnarchiving
      isClosed
      status
      settings {
        mode
      }
    }
  `,
  viewer: graphql`
    fragment ArchiveStoryActionsContainer_viewer on User {
      role
    }
  `,
})(ArchiveStoryActionsContainer);

export default enhanced;
