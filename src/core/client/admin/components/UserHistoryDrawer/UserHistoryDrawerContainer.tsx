import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { UserHistoryDrawerContainer_settings } from "coral-admin/__generated__/UserHistoryDrawerContainer_settings.graphql";
import { UserHistoryDrawerContainer_user } from "coral-admin/__generated__/UserHistoryDrawerContainer_user.graphql";
import { UserStatusChangeContainer } from "coral-admin/components/UserStatus";
import { CopyButton } from "coral-framework/components";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Button, Flex, Icon, Typography } from "coral-ui/components";

import RecentHistoryContainer from "./RecentHistoryContainer";
import Tabs from "./Tabs";
import UserBadgesContainer from "./UserBadgesContainer";
import UserStatusDetailsContainer from "./UserStatusDetailsContainer";

import styles from "./UserHistoryDrawerContainer.css";

interface Props {
  user: UserHistoryDrawerContainer_user;
  settings: UserHistoryDrawerContainer_settings;
  onClose: () => void;
}

const UserHistoryDrawerContainer: FunctionComponent<Props> = ({
  settings,
  user,
  onClose,
}) => {
  const { locales } = useCoralContext();
  const formatter = new Intl.DateTimeFormat(locales, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Button className={styles.close} onClick={onClose}>
        <Icon size="md">close</Icon>
      </Button>
      <div>
        <Flex className={styles.username} itemGutter>
          <span>{user.username}</span>
          <div>
            <UserBadgesContainer user={user} />
          </div>
        </Flex>
        <div className={styles.userStatus}>
          <Flex alignItems="center" itemGutter="half">
            <div className={styles.userStatusLabel}>
              <Typography variant="bodyCopyBold" container="div">
                <Flex alignItems="center" itemGutter="half">
                  <Localized id="moderate-user-drawer-status-label">
                    Status:
                  </Localized>
                </Flex>
              </Typography>
            </div>
            <div className={styles.userStatusChange}>
              <UserStatusChangeContainer settings={settings} user={user} />
            </div>
            <UserStatusDetailsContainer user={user} />
          </Flex>
        </div>
      </div>
      <div>
        <Flex alignItems="center" className={styles.userDetail}>
          <Localized id="moderate-user-drawer-email" attrs={{ title: true }}>
            <Icon size="sm" className={styles.icon} title="Email address">
              mail_outline
            </Icon>
          </Localized>
          <Typography
            variant="bodyCopy"
            container="span"
            className={styles.userDetailValue}
          >
            {user.email}
          </Typography>
          <CopyButton
            text={user.email!}
            variant="regular"
            className={styles.copy}
          />
        </Flex>
        <Flex alignItems="center" className={styles.userDetail}>
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
          <Typography variant="bodyCopy" container="span">
            {formatter.format(new Date(user.createdAt))}
          </Typography>
        </Flex>
        <Flex alignItems="center" className={styles.userDetail}>
          <Localized
            id="moderate-user-drawer-member-id"
            attrs={{ title: true }}
          >
            <Icon size="sm" className={styles.icon} title="Member ID">
              people_outline
            </Icon>
          </Localized>
          <Typography
            variant="bodyCopy"
            container="span"
            className={styles.userDetailValue}
          >
            {user.id}
          </Typography>
          <CopyButton
            text={user.id}
            variant="regular"
            className={styles.copy}
          />
        </Flex>
        <RecentHistoryContainer user={user} settings={settings} />
      </div>
      <hr className={styles.divider} />
      <div className={styles.comments}>
        <Tabs userID={user.id} notesCount={user.moderatorNotes.length} />
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
})(UserHistoryDrawerContainer);

export default enhanced;
