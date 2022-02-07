import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "relay-runtime";

import { Ability, can } from "coral-admin/permissions";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSTORY_MODE, GQLSTORY_STATUS } from "coral-framework/schema";
import { Button } from "coral-ui/components/v3";

import { ArchiveStory_local } from "coral-admin/__generated__/ArchiveStory_local.graphql";
import { ArchiveStory_story } from "coral-admin/__generated__/ArchiveStory_story.graphql";
import { ArchiveStory_viewer } from "coral-admin/__generated__/ArchiveStory_viewer.graphql";

import { Localized } from "@fluent/react/compat";
import ArchiveStoriesMutation from "./ArchiveStoriesMutation";
import UnarchiveStoriesMutation from "./UnarchiveStoriesMutation";

import styles from "./ArchiveStory.css";

export interface Props {
  story: ArchiveStory_story;
  viewer: ArchiveStory_viewer;
}

const ArchiveStory: FunctionComponent<Props> = ({ story, viewer }) => {
  const archiveStory = useMutation(ArchiveStoriesMutation);
  const unarchiveStory = useMutation(UnarchiveStoriesMutation);

  const [{ archivingEnabled }] = useLocal<ArchiveStory_local>(graphql`
    fragment ArchiveStory_local on Local {
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

  if (canArchive) {
    return (
      <Localized id="archiveStory-archive">
        <Button
          className={styles.button}
          disabled={archiveTriggered}
          onClick={handleArchive}
          color="error"
        >
          Archive
        </Button>
      </Localized>
    );
  } else if (canUnarchive) {
    return (
      <Localized id="storyActions-archive">
        <Button className={styles.button} onClick={handleUnarchive}>
          Unarchive
        </Button>
      </Localized>
    );
  }

  return null;
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment ArchiveStory_story on Story {
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
  viewer: graphql`
    fragment ArchiveStory_viewer on User {
      role
    }
  `,
})(ArchiveStory);

export default enhanced;
