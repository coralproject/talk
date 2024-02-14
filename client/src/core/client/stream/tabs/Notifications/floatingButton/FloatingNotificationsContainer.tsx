import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql } from "react-relay";

import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { UserBoxContainer } from "coral-stream/common/UserBox";

import { FloatingNotificationsContainer_settings } from "coral-stream/__generated__/FloatingNotificationsContainer_settings.graphql";
import { FloatingNotificationsContainer_viewer } from "coral-stream/__generated__/FloatingNotificationsContainer_viewer.graphql";
import { FloatingNotificationsContainerLocal } from "coral-stream/__generated__/FloatingNotificationsContainerLocal.graphql";

import FloatingNotificationsListQuery from "./FloatingNotificationsListQuery";

import styles from "./FloatingNotificationsContainer.css";

interface Props {
  viewer: FloatingNotificationsContainer_viewer;
  settings: FloatingNotificationsContainer_settings;

  showUserBox?: boolean;
  showTitle?: boolean;
}

const FloatingNotificationsContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
  showUserBox = true,
  showTitle = true,
}) => {
  const [, setLocal] = useLocal<FloatingNotificationsContainerLocal>(graphql`
    fragment FloatingNotificationsContainerLocal on Local {
      hasNewNotifications
    }
  `);

  const setViewed = useCallback(() => {
    setLocal({ hasNewNotifications: false });
  }, [setLocal]);

  useEffect(() => {
    setTimeout(setViewed, 300);
  }, [setViewed]);

  return (
    <>
      {showUserBox && (
        <div className={styles.userBox}>
          <UserBoxContainer viewer={viewer} settings={settings} />
        </div>
      )}
      {showTitle && (
        <div className={styles.title}>
          <Localized id="notifications-title">Notifications</Localized>
        </div>
      )}
      <FloatingNotificationsListQuery viewerID={viewer.id} />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment FloatingNotificationsContainer_viewer on User {
      id
      ...UserBoxContainer_viewer
    }
  `,
  settings: graphql`
    fragment FloatingNotificationsContainer_settings on Settings {
      ...UserBoxContainer_settings
    }
  `,
})(FloatingNotificationsContainer);

export default enhanced;
