import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql } from "react-relay";

import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { UserBoxContainer } from "coral-stream/common/UserBox";

import { NotificationsContainer_settings } from "coral-stream/__generated__/NotificationsContainer_settings.graphql";
import { NotificationsContainer_viewer } from "coral-stream/__generated__/NotificationsContainer_viewer.graphql";
import { NotificationsContainerLocal } from "coral-stream/__generated__/NotificationsContainerLocal.graphql";

import NotificationsListQuery from "./NotificationsListQuery";

import styles from "./NotificationsContainer.css";

interface Props {
  viewer: NotificationsContainer_viewer;
  settings: NotificationsContainer_settings;
}

const NotificationsContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  const [, setLocal] = useLocal<NotificationsContainerLocal>(graphql`
    fragment NotificationsContainerLocal on Local {
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
      <div className={styles.userBox}>
        <UserBoxContainer viewer={viewer} settings={settings} />
      </div>
      <NotificationsListQuery viewerID={viewer.id} />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment NotificationsContainer_viewer on User {
      id
      ...UserBoxContainer_viewer
    }
  `,
  settings: graphql`
    fragment NotificationsContainer_settings on Settings {
      ...UserBoxContainer_settings
    }
  `,
})(NotificationsContainer);

export default enhanced;
