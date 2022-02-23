import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { UserStatusChangeContainer } from "coral-admin/components/UserStatus";
import { CopyButton } from "coral-framework/components";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  Divider,
  Flex,
  HorizontalGutter,
  Icon,
  Tooltip,
  TooltipButton,
} from "coral-ui/components/v2";

import { UserHistoryDrawerContainer_settings$data as UserHistoryDrawerContainer_settings } from "coral-admin/__generated__/UserHistoryDrawerContainer_settings.graphql";
import { UserHistoryDrawerContainer_user$data as UserHistoryDrawerContainer_user } from "coral-admin/__generated__/UserHistoryDrawerContainer_user.graphql";
import { UserHistoryDrawerContainer_viewer$data as UserHistoryDrawerContainer_viewer } from "coral-admin/__generated__/UserHistoryDrawerContainer_viewer.graphql";

import MemberBioContainer from "./MemberBioContainer";
import RecentHistoryContainer from "./RecentHistoryContainer";
import Tabs from "./Tabs";
import UserBadgesContainer from "./UserBadgesContainer";
import UserStatusDetailsContainer from "./UserStatusDetailsContainer";

import styles from "./UserHistoryDrawerContainer.css";

interface Props {
  user: UserHistoryDrawerContainer_user;
  settings: UserHistoryDrawerContainer_settings;
  viewer: UserHistoryDrawerContainer_viewer;
  onClose: () => void;
  setUserID?: (id: string) => void;
}

const UserHistoryDrawerContainer: FunctionComponent<Props> = ({
  settings,
  user,
  viewer,
  onClose,
  setUserID,
}) => {
  const formatter = useDateTimeFormatter({
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Button variant="text" className={styles.close} onClick={onClose}>
        <Icon size="md">close</Icon>
      </Button>
      <HorizontalGutter spacing={4}>
        <HorizontalGutter spacing={3}>
          <HorizontalGutter spacing={2}>
            <Flex className={styles.username} spacing={2}>
              {user.username ? (
                <span>{user.username}</span>
              ) : (
                <Flex alignItems="center">
                  <Localized id="moderate-user-drawer-username-not-available">
                    <span className={styles.notAvailable}>
                      Username not available
                    </span>
                  </Localized>
                  <Tooltip
                    id="recentCommentHistory-rejectionPopover"
                    title={
                      <Localized id="moderate-user-drawer-username-not-available-tooltip-title">
                        <span>Username not available</span>
                      </Localized>
                    }
                    body={
                      <Localized id="moderate-user-drawer-username-not-available-tooltip-body">
                        <span>User did not complete account setup process</span>
                      </Localized>
                    }
                    button={({ toggleVisibility, ref }) => (
                      <Localized
                        id="moderate-user-drawer-username-not-available-tooltip-button"
                        attrs={{ "aria-label": true }}
                      >
                        <TooltipButton
                          aria-label="Toggle username not available tooltip"
                          toggleVisibility={toggleVisibility}
                          ref={ref}
                        />
                      </Localized>
                    )}
                  />
                </Flex>
              )}
              <div>
                <UserBadgesContainer user={user} />
              </div>
            </Flex>
            <Flex alignItems="center" spacing={1}>
              <div className={styles.userStatusLabel}>
                <Flex alignItems="center" spacing={1}>
                  <Localized id="moderate-user-drawer-status-label">
                    Status:
                  </Localized>
                </Flex>
              </div>
              <div className={styles.userStatusChange}>
                <UserStatusChangeContainer
                  bordered={true}
                  settings={settings}
                  user={user}
                  viewer={viewer}
                />
              </div>
              <UserStatusDetailsContainer user={user} />
            </Flex>
          </HorizontalGutter>
          <HorizontalGutter spacing={1}>
            <Flex alignItems="center" spacing={2}>
              <Localized
                id="moderate-user-drawer-email"
                attrs={{ title: true }}
              >
                <Icon size="sm" className={styles.icon} title="Email address">
                  mail_outline
                </Icon>
              </Localized>
              <span className={styles.userDetailValue}>{user.email}</span>
              <CopyButton text={user.email!} />
            </Flex>
            <Flex alignItems="center" spacing={2}>
              <Localized
                id="moderate-user-drawer-created-at"
                attrs={{ title: true }}
              >
                <Icon
                  size="sm"
                  className={styles.icon}
                  title="Account creation date"
                >
                  date_range
                </Icon>
              </Localized>
              <span className={styles.userDetailValue}>
                {formatter(user.createdAt)}
              </span>
            </Flex>
            <Flex alignItems="center" spacing={2}>
              <Localized
                id="moderate-user-drawer-member-id"
                attrs={{ title: true }}
              >
                <Icon size="sm" className={styles.icon} title="Member ID">
                  people_outline
                </Icon>
              </Localized>
              <span className={styles.userDetailValue}>{user.id}</span>
              <CopyButton text={user.id} />
            </Flex>
          </HorizontalGutter>
        </HorizontalGutter>
        <MemberBioContainer user={user} />
        <RecentHistoryContainer user={user} settings={settings} />
      </HorizontalGutter>
      <Divider />
      <div className={styles.comments}>
        <Tabs
          userID={user.id}
          notesCount={user.moderatorNotes.length}
          setUserID={setUserID}
        />
      </div>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment UserHistoryDrawerContainer_user on User {
      ...UserBadgesContainer_user
      ...UserStatusChangeContainer_user
      ...UserStatusDetailsContainer_user
      ...RecentHistoryContainer_user
      ...MemberBioContainer_user
      moderatorNotes {
        id
      }
      id
      username
      email
      createdAt
    }
  `,
  settings: graphql`
    fragment UserHistoryDrawerContainer_settings on Settings {
      ...RecentHistoryContainer_settings
      ...UserStatusChangeContainer_settings
      organization {
        name
      }
    }
  `,
  viewer: graphql`
    fragment UserHistoryDrawerContainer_viewer on User {
      ...UserStatusChangeContainer_viewer
    }
  `,
})(UserHistoryDrawerContainer);

export default enhanced;
