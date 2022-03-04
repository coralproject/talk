import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import CLASSES from "coral-stream/classes";
import { DropdownButton, Icon, Spinner } from "coral-ui/components/v2";

import { ModerationActionBanContainer_user$key as ModerationActionBanContainer_user } from "coral-stream/__generated__/ModerationActionBanContainer_user.graphql";

import styles from "./ModerationActionBanContainer.css";

interface Props {
  /** user in question or null if still loading */
  user: ModerationActionBanContainer_user | null;
  onBan: () => void;
}

const ModerationActionBanContainer: FunctionComponent<Props> = ({
  user,
  onBan,
}) => {
  const userData = useFragment(
    graphql`
      fragment ModerationActionBanContainer_user on User {
        id
        status {
          ban {
            active
          }
        }
      }
    `,
    user
  );

  if (!userData) {
    return (
      <Localized id="comments-moderationDropdown-ban">
        <DropdownButton
          icon={
            <div className={styles.banIcon}>
              <Icon size="sm">block</Icon>
            </div>
          }
          adornment={<Spinner size="xs" className={styles.spinner} />}
          className={CLASSES.moderationDropdown.banUserButton}
          classes={{
            root: styles.label,
            mouseHover: styles.mouseHover,
          }}
          disabled
        >
          Ban User
        </DropdownButton>
      </Localized>
    );
  }
  const banned = userData.status.ban.active;
  if (banned) {
    return (
      <Localized id="comments-moderationDropdown-banned">
        <DropdownButton
          icon={
            <div className={cn(styles.banIcon, styles.banned)}>
              <Icon size="sm">block</Icon>
            </div>
          }
          className={CLASSES.moderationDropdown.bannedButton}
          classes={{
            root: cn(styles.label, styles.banned),
            mouseHover: styles.mouseHover,
          }}
          disabled
        >
          Banned
        </DropdownButton>
      </Localized>
    );
  }
  return (
    <Localized id="comments-moderationDropdown-ban">
      <DropdownButton
        icon={
          <div className={styles.banIcon}>
            <Icon size="sm">block</Icon>
          </div>
        }
        onClick={onBan}
        className={CLASSES.moderationDropdown.banUserButton}
        classes={{
          root: styles.label,
          mouseHover: styles.mouseHover,
        }}
      >
        Ban User
      </DropdownButton>
    </Localized>
  );
};

export default ModerationActionBanContainer;
