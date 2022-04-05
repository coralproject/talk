import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { DropdownButton, Icon, Spinner } from "coral-ui/components/v2";

import { ModerationActionBanContainer_user } from "coral-stream/__generated__/ModerationActionBanContainer_user.graphql";

import styles from "./ModerationActionBanContainer.css";

interface Props {
  /** user in question or null if still loading */
  user: ModerationActionBanContainer_user | null;
  viewerScoped: boolean | null;
  onBan: () => void;
  onSiteBan: () => void;
  siteID: string;
}

const ModerationActionBanContainer: FunctionComponent<Props> = ({
  user,
  viewerScoped,
  onBan,
  onSiteBan,
  siteID,
}) => {
  if (!user) {
    return (
      <>
        <Localized id="comments-moderationDropdown-siteBan">
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
            Site Ban
          </DropdownButton>
        </Localized>
        {!viewerScoped && (
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
        )}
      </>
    );
  } else {
    const siteBans = user.status.ban.sites?.map((s) => s.id);
    const allSiteBanned =
      !!user.status.ban.active && !(siteBans && siteBans.length > 0);
    const siteBanned = siteBans && siteBans.includes(siteID);
    return (
      <>
        <Localized id="comments-moderationDropdown-siteBan">
          <DropdownButton
            icon={
              <div className={styles.banIcon}>
                <Icon size="sm">block</Icon>
              </div>
            }
            onClick={onSiteBan}
            className={CLASSES.moderationDropdown.banUserButton}
            classes={{
              root: styles.label,
              mouseHover: styles.mouseHover,
            }}
            disabled={!!siteBanned || allSiteBanned}
          >
            Site Ban
          </DropdownButton>
        </Localized>{" "}
        {!viewerScoped && (
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
              disabled={allSiteBanned}
            >
              Ban User
            </DropdownButton>
          </Localized>
        )}
      </>
    );
  }
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment ModerationActionBanContainer_user on User {
      id
      status {
        ban {
          active
          sites {
            id
          }
        }
      }
    }
  `,
})(ModerationActionBanContainer);

export default enhanced;
