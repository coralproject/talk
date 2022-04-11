import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Ability, can } from "coral-framework/permissions";
import { GQLFEATURE_FLAG, GQLSTORY_MODE } from "coral-framework/schema";
import { StreamLocalContext } from "coral-stream/local/StreamLocalProvider";

import { TabBarContainer_settings } from "coral-stream/__generated__/TabBarContainer_settings.graphql";
import { TabBarContainer_story } from "coral-stream/__generated__/TabBarContainer_story.graphql";
import { TabBarContainer_viewer } from "coral-stream/__generated__/TabBarContainer_viewer.graphql";

import { TabValue } from "./App";
import TabBar from "./TabBar";

interface Props {
  story: TabBarContainer_story | null;
  settings: TabBarContainer_settings | null;
  viewer: TabBarContainer_viewer | null;
}

export const TabBarContainer: FunctionComponent<Props> = ({
  viewer,
  story,
  settings,
}) => {
  const local = useContext(StreamLocalContext);
  const handleSetActiveTab = useCallback(
    (tab: TabValue) => {
      if (local) {
        local.setActiveTab(tab);
      }
    },
    [local]
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

  if (!local) {
    return null;
  }

  return (
    <TabBar
      mode={story ? story.settings.mode : GQLSTORY_MODE.COMMENTS}
      activeTab={local?.activeTab}
      showProfileTab={!!viewer}
      showDiscussionsTab={showDiscussionsTab}
      showConfigureTab={showConfigureTab}
      onTabClick={handleSetActiveTab}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
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
})(TabBarContainer);

export default enhanced;
