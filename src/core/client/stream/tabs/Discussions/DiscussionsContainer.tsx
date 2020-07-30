import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import {
  createMutation,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import { Button, HorizontalGutter } from "coral-ui/components/v2";

import { DiscussionsContainer_settings } from "coral-stream/__generated__/DiscussionsContainer_settings.graphql";
import { DiscussionsContainer_story } from "coral-stream/__generated__/DiscussionsContainer_story.graphql";
import { DiscussionsContainer_viewer } from "coral-stream/__generated__/DiscussionsContainer_viewer.graphql";

import { commit } from "../../App/SetActiveTabMutation";
import MostActiveDiscussionsContainer from "./MostActiveDiscussionsContainer";
import MyOngoingDiscussionsContainer from "./MyOngoingDiscussionsContainer";

interface Props {
  viewer: DiscussionsContainer_viewer;
  settings: DiscussionsContainer_settings;
  story: DiscussionsContainer_story;
}

const SetActiveTabMutation = createMutation("setActiveTab", commit);

const DiscussionsContainer: FunctionComponent<Props> = (props) => {
  const setActiveTab = useMutation(SetActiveTabMutation);
  const onFullHistoryClick = useCallback(
    async () => await setActiveTab({ tab: "PROFILE" }),
    []
  );
  return (
    <HorizontalGutter spacing={3} className={CLASSES.discussions.$root}>
      <UserBoxContainer settings={props.settings} viewer={props.viewer} />
      <MostActiveDiscussionsContainer site={props.story.site} />
      <MyOngoingDiscussionsContainer
        viewer={props.viewer}
        currentSiteID={props.story.site.id}
        settings={props.settings}
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

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment DiscussionsContainer_story on Story {
      site {
        id
        ...MostActiveDiscussionsContainer_site
      }
    }
  `,
  viewer: graphql`
    fragment DiscussionsContainer_viewer on User {
      ...MyOngoingDiscussionsContainer_viewer
      ...UserBoxContainer_viewer
    }
  `,
  settings: graphql`
    fragment DiscussionsContainer_settings on Settings {
      ...MyOngoingDiscussionsContainer_settings
      ...UserBoxContainer_settings
      organization {
        name
      }
    }
  `,
})(DiscussionsContainer);

export default enhanced;
