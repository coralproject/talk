/* eslint-disable */
import { graphql } from "relay-runtime";
import React, { FunctionComponent } from "react";

import { Ability, can } from "coral-admin/permissions";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { GQLSTORY_MODE, GQLSTORY_STATUS } from "coral-framework/schema";
import { Button } from "coral-ui/components/v3";

import { ArchiveStory_local } from "coral-admin/__generated__/ArchiveStory_local.graphql";
import { StoryInfoDrawerContainer_story } from "coral-admin/__generated__/StoryInfoDrawerContainer_story.graphql";
import { StoryInfoDrawerContainer_viewer } from "coral-admin/__generated__/StoryInfoDrawerContainer_viewer.graphql";

import ArchiveStoriesMutation from "./ArchiveStoriesMutation";
import UnarchiveStoriesMutation from "./UnarchiveStoriesMutation";
import { Localized } from "@fluent/react/compat";

export interface Props {
  story: StoryInfoDrawerContainer_story;
  viewer: StoryInfoDrawerContainer_viewer;
}

const ArchiveStory: FunctionComponent<Props> = ({ story, viewer }) => {
  debugger;
  const archiveStory = useMutation(ArchiveStoriesMutation);
  const unarchiveStory = useMutation(UnarchiveStoriesMutation);

  const [{ archivingEnabled }] = useLocal<ArchiveStory_local>(graphql`
    fragment ArchiveStory_local on Local {
      archivingEnabled
    }
  `);

  const viewCanArchive = can(viewer, Ability.ARCHIVE_STORY);

  const canArchive = (
    archivingEnabled &&
    viewCanArchive &&
    !story.isArchiving &&
    !story.isArchived &&
    story.settings?.mode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS
  );

  const canUnarchive = (
    archivingEnabled &&
    story.status === GQLSTORY_STATUS.CLOSED &&
    viewCanArchive &&
    !story.isArchiving &&
    story.isArchived
  );

  if (canArchive) {
    return (
      <Localized id="archiveStory-archive">
        <Button

        >
          Archive
        </Button>
      </Localized>
    );
  } else if (canUnarchive) {
    return (
      <Localized id="archiveStory-unarchive">
        <Button>
          Unarchive
        </Button>
      </Localized>
    );
  }

  return null;
};

export default ArchiveStory;
