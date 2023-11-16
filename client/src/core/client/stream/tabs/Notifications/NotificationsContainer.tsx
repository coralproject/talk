import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql } from "react-relay";

import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLDSA_METHOD_OF_REDRESS } from "coral-framework/schema";
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
      <div className={styles.title}>
        <Localized id="notifications-title">Notifications</Localized>
      </div>
      <div className={styles.methodOfRedress}>
        {settings.dsa.methodOfRedress.method ===
          GQLDSA_METHOD_OF_REDRESS.NONE && (
          <Localized id="notifications-methodOfRedress-none">
            All moderation decisions are final and cannot be appealed
          </Localized>
        )}
        {settings.dsa.methodOfRedress.method ===
          GQLDSA_METHOD_OF_REDRESS.EMAIL && (
          <Localized
            id="notifications-methodOfRedress-email"
            vars={{
              email: settings.dsa.methodOfRedress.email,
            }}
          >
            {`To appeal a decision that appears here please contact ${settings.dsa.methodOfRedress.email}`}
          </Localized>
        )}
        {settings.dsa.methodOfRedress.method ===
          GQLDSA_METHOD_OF_REDRESS.URL && (
          <Localized
            id="notifications-methodOfRedress-url"
            vars={{
              url: settings.dsa.methodOfRedress.url,
            }}
          >
            {`To appeal a decision that appears here please visit ${settings.dsa.methodOfRedress.url}`}
          </Localized>
        )}
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
      dsa {
        methodOfRedress {
          method
          email
          url
        }
      }
    }
  `,
})(NotificationsContainer);

export default enhanced;
