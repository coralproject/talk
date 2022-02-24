import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { DropdownButton, Icon, Spinner } from "coral-ui/components/v2";

import { ModerationActionBanContainer_user$data as ModerationActionBanContainer_user } from "coral-stream/__generated__/ModerationActionBanContainer_user.graphql";

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
  if (!user) {
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
  const banned = user.status.ban.active;
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

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment ModerationActionBanContainer_user on User {
      id
      status {
        ban {
          active
        }
      }
    }
  `,
})(ModerationActionBanContainer);

export default enhanced;
