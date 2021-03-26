import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";

import {
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG, GQLSTORY_MODE } from "coral-framework/schema";
import { Ability, can } from "coral-stream/permissions";

import { TabBarContainer_settings } from "coral-stream/__generated__/TabBarContainer_settings.graphql";
import {
  STORY_MODE,
  TabBarContainer_story,
} from "coral-stream/__generated__/TabBarContainer_story.graphql";
import { TabBarContainer_viewer } from "coral-stream/__generated__/TabBarContainer_viewer.graphql";
import { TabBarContainerLocal } from "coral-stream/__generated__/TabBarContainerLocal.graphql";

import {
  SetActiveTabInput,
  SetActiveTabMutation,
  withSetActiveTabMutation,
} from "./SetActiveTabMutation";
import TabBar from "./TabBar";

interface Props {
  story: TabBarContainer_story | null;
  settings: TabBarContainer_settings | null;
  viewer: TabBarContainer_viewer | null;
  local: TabBarContainerLocal;
  setActiveTab: SetActiveTabMutation;
}

export const TabBarContainer: FunctionComponent<Props> = ({
  local: { activeTab, storyMode },
  viewer,
  story,
  settings,
  setActiveTab,
}) => {
  const handleSetActiveTab = useCallback(
    (tab: SetActiveTabInput["tab"]) => {
      void setActiveTab({ tab });
    },
    [setActiveTab]
  );

  const showDiscussionsTab = useMemo(
    () =>
      !!viewer &&
      !!settings &&
      settings.featureFlags.includes(GQLFEATURE_FLAG.DISCUSSIONS),
    [viewer, settings]
  );

  const showConfigureTab = useMemo(
    () =>
      !!viewer &&
      !!story &&
      story.canModerate &&
      can(viewer, Ability.CHANGE_STORY_CONFIGURATION),
    [viewer, story]
  );

  let mode: STORY_MODE = GQLSTORY_MODE.COMMENTS;
  if (storyMode) {
    mode = storyMode;
  } else if (story && story.settings && story.settings.mode) {
    mode = story.settings.mode;
  }

  return (
    <TabBar
      mode={mode}
      activeTab={activeTab}
      showProfileTab={!!viewer}
      showDiscussionsTab={showDiscussionsTab}
      showConfigureTab={showConfigureTab}
      onTabClick={handleSetActiveTab}
    />
  );
};

const enhanced = withSetActiveTabMutation(
  withLocalStateContainer(
    graphql`
      fragment TabBarContainerLocal on Local {
        activeTab
        storyMode
      }
    `
  )(
    withFragmentContainer<Props>({
      viewer: graphql`
        fragment TabBarContainer_viewer on User {
          role
        }
      `,
      story: graphql`
        fragment TabBarContainer_story on Story {
          canModerate
          settings {
            mode
          }
        }
      `,
      settings: graphql`
        fragment TabBarContainer_settings on Settings {
          featureFlags
        }
      `,
    })(TabBarContainer)
  )
);

export default enhanced;
