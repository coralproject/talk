import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { createMutation, useMutation } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import { Button, HorizontalGutter } from "coral-ui/components/v2";

import { DiscussionsContainer_settings$key as DiscussionsContainer_settings } from "coral-stream/__generated__/DiscussionsContainer_settings.graphql";
import { DiscussionsContainer_story$key as DiscussionsContainer_story } from "coral-stream/__generated__/DiscussionsContainer_story.graphql";
import { DiscussionsContainer_viewer$key as DiscussionsContainer_viewer } from "coral-stream/__generated__/DiscussionsContainer_viewer.graphql";

import { commit } from "../../App/SetActiveTabMutation";
import MostActiveDiscussionsContainer from "./MostActiveDiscussionsContainer";
import MyOngoingDiscussionsContainer from "./MyOngoingDiscussionsContainer";

interface Props {
  viewer: DiscussionsContainer_viewer;
  settings: DiscussionsContainer_settings;
  story: DiscussionsContainer_story;
}

const SetActiveTabMutation = createMutation("setActiveTab", commit);

const DiscussionsContainer: FunctionComponent<Props> = ({
  story,
  viewer,
  settings,
}) => {
  const storyData = useFragment(
    graphql`
      fragment DiscussionsContainer_story on Story {
        site {
          id
          ...MostActiveDiscussionsContainer_site
        }
      }
    `,
    story
  );
  const viewerData = useFragment(
    graphql`
      fragment DiscussionsContainer_viewer on User {
        ...MyOngoingDiscussionsContainer_viewer
        ...UserBoxContainer_viewer
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment DiscussionsContainer_settings on Settings {
        ...MyOngoingDiscussionsContainer_settings
        ...UserBoxContainer_settings
        organization {
          name
        }
      }
    `,
    settings
  );

  const setActiveTab = useMutation(SetActiveTabMutation);
  const onFullHistoryClick = useCallback(
    async () => await setActiveTab({ tab: "PROFILE" }),
    [setActiveTab]
  );
  return (
    <HorizontalGutter spacing={3} className={CLASSES.discussions.$root}>
      <UserBoxContainer settings={settingsData} viewer={viewerData} />
      <MostActiveDiscussionsContainer site={storyData.site} />
      <MyOngoingDiscussionsContainer
        viewer={viewerData}
        currentSiteID={storyData.site.id}
        settings={settingsData}
      />
      <Localized id="discussions-viewFullHistory">
        <Button
          variant="outlined"
          color="stream"
          onClick={onFullHistoryClick}
          className={CLASSES.discussions.viewHistoryButton}
        >
          View full comment history
        </Button>
      </Localized>
    </HorizontalGutter>
  );
};

export default DiscussionsContainer;
