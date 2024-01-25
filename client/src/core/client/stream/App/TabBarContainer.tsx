import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { Ability, can } from "coral-framework/permissions";
import { GQLFEATURE_FLAG, GQLSTORY_MODE } from "coral-framework/schema";
import { SetCommentIDMutation } from "coral-stream/mutations";
import FloatingNotificationButton from "coral-stream/tabs/Notifications/FloatingNotificationButton";
import useLiveNotificationsPolling from "coral-stream/tabs/Notifications/polling/useLiveNotificationsPolling";

import { TabBarContainer_settings } from "coral-stream/__generated__/TabBarContainer_settings.graphql";
import { TabBarContainer_story } from "coral-stream/__generated__/TabBarContainer_story.graphql";
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
  setActiveTab: SetActiveTabMutation;
}

// use this to avoid linting errors complaining about casting
// a possible `any` to `string | undefined` when initializing
// the live notifications polling.
const getViewerID = (
  viewer: TabBarContainer_viewer | null
): string | undefined => {
  if (!viewer) {
    return undefined;
  }

  return viewer.id;
};

export const TabBarContainer: FunctionComponent<Props> = ({
  viewer,
  story,
  settings,
  setActiveTab,
}) => {
  useLiveNotificationsPolling(getViewerID(viewer));

  const setCommentID = useMutation(SetCommentIDMutation);
  const { window } = useCoralContext();
  const [{ activeTab, hasNewNotifications }] =
    useLocal<TabBarContainerLocal>(graphql`
      fragment TabBarContainerLocal on Local {
        activeTab
        hasNewNotifications
      }
    `);
  const handleSetActiveTab = useCallback(
    (tab: SetActiveTabInput["tab"]) => {
      void setActiveTab({ tab });
      if (tab === "COMMENTS") {
        void setCommentID({ id: null });
        const pathName = window.location.pathname;
        history.pushState(null, "", pathName);
      }
    },
    [setActiveTab, setCommentID, window]
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

  return (
    <>
      <FloatingNotificationButton viewerID={viewer?.id} />
      <TabBar
        mode={story ? story.settings.mode : GQLSTORY_MODE.COMMENTS}
        activeTab={activeTab}
        showProfileTab={!!viewer}
        showDiscussionsTab={showDiscussionsTab}
        showConfigureTab={showConfigureTab}
        showNotificationsTab={!!viewer}
        hasNewNotifications={!!hasNewNotifications}
        onTabClick={handleSetActiveTab}
      />
    </>
  );
};

const enhanced = withSetActiveTabMutation(
  withFragmentContainer<Props>({
    viewer: graphql`
      fragment TabBarContainer_viewer on User {
        id
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
);

export default enhanced;
