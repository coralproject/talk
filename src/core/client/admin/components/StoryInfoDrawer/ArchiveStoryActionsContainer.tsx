import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

import { Ability, can } from "coral-admin/permissions";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { GQLSTORY_MODE, GQLSTORY_STATUS } from "coral-framework/schema";
import { Button } from "coral-ui/components/v3";

import { ArchiveStoryActionsContainer_local } from "coral-admin/__generated__/ArchiveStoryActionsContainer_local.graphql";
import { ArchiveStoryActionsContainer_story$key as ArchiveStoryActionsContainer_story } from "coral-admin/__generated__/ArchiveStoryActionsContainer_story.graphql";
import { ArchiveStoryActionsContainer_viewer$key as ArchiveStoryActionsContainer_viewer } from "coral-admin/__generated__/ArchiveStoryActionsContainer_viewer.graphql";

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
  const storyData = useFragment(
    graphql`
      fragment ArchiveStoryActionsContainer_story on Story {
        id
        isArchiving
        isArchived
        isClosed
        status
        settings {
          mode
        }
      }
    `,
    story
  );
  const viewerData = useFragment(
    graphql`
      fragment ArchiveStoryActionsContainer_viewer on User {
        role
      }
    `,
    viewer
  );

  const archiveStory = useMutation(ArchiveStoriesMutation);
  const unarchiveStory = useMutation(UnarchiveStoriesMutation);

  const [{ archivingEnabled }] = useLocal<
    ArchiveStoryActionsContainer_local
  >(graphql`
    fragment ArchiveStoryActionsContainer_local on Local {
      archivingEnabled
    }
  `);

  const [archiveTriggered, setArchiveTriggered] = useState(false);

  const handleArchive = useCallback(() => {
    setArchiveTriggered(true);
    void archiveStory({ storyIDs: [storyData.id] });
  }, [storyData, archiveStory]);
  const handleUnarchive = useCallback(
    () => unarchiveStory({ storyIDs: [storyData.id] }),
    [storyData, unarchiveStory]
  );

  const viewCanArchive = can(viewerData, Ability.ARCHIVE_STORY);

  const canArchive =
    archivingEnabled &&
    viewCanArchive &&
    !storyData.isArchiving &&
    !storyData.isArchived &&
    storyData.settings?.mode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS;

  const canUnarchive =
    archivingEnabled &&
    storyData.status === GQLSTORY_STATUS.CLOSED &&
    viewCanArchive &&
    !storyData.isArchiving &&
    storyData.isArchived;

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

export default ArchiveStoryActionsContainer;
