import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import Spinner from "coral-stream/common/Spinner";
import { DropdownButton, Icon } from "coral-ui/components/v2";

import { ModerationActionBanContainer_user } from "coral-stream/__generated__/ModerationActionBanContainer_user.graphql";

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
          className={cn(styles.label, CLASSES.moderationDropdown.banUserButton)}
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
          className={cn(
            styles.label,
            styles.banned,
            CLASSES.moderationDropdown.bannedButton
          )}
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
        className={cn(styles.label, CLASSES.moderationDropdown.banUserButton)}
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
