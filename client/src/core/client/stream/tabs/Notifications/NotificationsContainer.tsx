import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { UserBoxContainer } from "coral-stream/common/UserBox";

import { NotificationsContainer_settings } from "coral-stream/__generated__/NotificationsContainer_settings.graphql";
import { NotificationsContainer_viewer } from "coral-stream/__generated__/NotificationsContainer_viewer.graphql";

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
