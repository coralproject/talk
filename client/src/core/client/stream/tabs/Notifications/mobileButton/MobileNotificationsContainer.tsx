import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql } from "react-relay";

import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { UserBoxContainer } from "coral-stream/common/UserBox";

import { MobileNotificationsContainer_settings } from "coral-stream/__generated__/MobileNotificationsContainer_settings.graphql";
import { MobileNotificationsContainer_viewer } from "coral-stream/__generated__/MobileNotificationsContainer_viewer.graphql";
import { MobileNotificationsContainerLocal } from "coral-stream/__generated__/MobileNotificationsContainerLocal.graphql";

import FloatingNotificationsListQuery from "./MobileNotificationsListQuery";

import styles from "./MobileNotificationsContainer.css";

interface Props {
  viewer: MobileNotificationsContainer_viewer;
  settings: MobileNotificationsContainer_settings;

  showUserBox?: boolean;
  showTitle?: boolean;
}

const MobileNotificationsContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
  showUserBox = true,
  showTitle = true,
}) => {
  const [, setLocal] = useLocal<MobileNotificationsContainerLocal>(graphql`
    fragment MobileNotificationsContainerLocal on Local {
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
    fragment MobileNotificationsContainer_viewer on User {
      id
      ...UserBoxContainer_viewer
    }
  `,
  settings: graphql`
    fragment MobileNotificationsContainer_settings on Settings {
      ...UserBoxContainer_settings
    }
  `,
})(MobileNotificationsContainer);

export default enhanced;
