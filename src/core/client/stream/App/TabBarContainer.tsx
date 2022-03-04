import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql, useFragment } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";
import { Ability, can } from "coral-framework/permissions";
import { GQLFEATURE_FLAG, GQLSTORY_MODE } from "coral-framework/schema";

import { TabBarContainer_settings$key as TabBarContainer_settings } from "coral-stream/__generated__/TabBarContainer_settings.graphql";
import { TabBarContainer_story$key as TabBarContainer_story } from "coral-stream/__generated__/TabBarContainer_story.graphql";
import { TabBarContainer_viewer$key as TabBarContainer_viewer } from "coral-stream/__generated__/TabBarContainer_viewer.graphql";
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
  setActiveTab: SetActiveTabMutation;
}

export const TabBarContainer: FunctionComponent<Props> = ({
  viewer,
  story,
  settings,
  setActiveTab,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment TabBarContainer_viewer on User {
        role
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment TabBarContainer_settings on Settings {
        featureFlags
      }
    `,
    settings
  );
  const storyData = useFragment(
    graphql`
      fragment TabBarContainer_story on Story {
        canModerate
        settings {
          mode
        }
      }
    `,
    story
  );

  const [{ activeTab }] = useLocal<TabBarContainerLocal>(graphql`
    fragment TabBarContainerLocal on Local {
      activeTab
    }
  `);
  const handleSetActiveTab = useCallback(
    (tab: SetActiveTabInput["tab"]) => {
      void setActiveTab({ tab });
    },
    [setActiveTab]
  );

  const showDiscussionsTab = useMemo(
    () =>
      !!viewerData &&
      !!settingsData &&
      settingsData.featureFlags.includes(GQLFEATURE_FLAG.DISCUSSIONS),
    [viewerData, settingsData]
  );

  const showConfigureTab = useMemo(
    () =>
      !!viewerData &&
      !!storyData &&
      storyData.canModerate &&
      can(viewerData, Ability.CHANGE_STORY_CONFIGURATION),
    [viewerData, storyData]
  );

  return (
    <TabBar
      mode={storyData ? storyData.settings.mode : GQLSTORY_MODE.COMMENTS}
      activeTab={activeTab}
      showProfileTab={!!viewerData}
      showDiscussionsTab={showDiscussionsTab}
      showConfigureTab={showConfigureTab}
      onTabClick={handleSetActiveTab}
    />
  );
};

const enhanced = withSetActiveTabMutation(TabBarContainer);

export default enhanced;
