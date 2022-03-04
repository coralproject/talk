import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql, useFragment } from "react-relay";

import { getModerationLink } from "coral-framework/helpers";
import { useLocal } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button, Tombstone } from "coral-ui/components/v3";

import { ModerationRejectedTombstoneContainer_comment$key as CommentData } from "coral-stream/__generated__/ModerationRejectedTombstoneContainer_comment.graphql";
import { ModerationRejectedTombstoneContainer_local } from "coral-stream/__generated__/ModerationRejectedTombstoneContainer_local.graphql";
import { ModerationRejectedTombstoneContainer_settings$key as SettingsData } from "coral-stream/__generated__/ModerationRejectedTombstoneContainer_settings.graphql";

import styles from "./ModerationRejectedTombstoneContainer.css";

interface Props {
  comment: CommentData;
  settings: SettingsData;
}

const ModerationRejectedTombstoneContainer: FunctionComponent<Props> = ({
  comment,
  settings,
}) => {
  const commentData = useFragment(
    graphql`
      fragment ModerationRejectedTombstoneContainer_comment on Comment {
        id
      }
    `,
    comment
  );
  const settingsData = useFragment(
    graphql`
      fragment ModerationRejectedTombstoneContainer_settings on Settings {
        auth {
          integrations {
            sso {
              enabled
              targetFilter {
                admin
              }
            }
          }
        }
      }
    `,
    settings
  );

  const [{ accessToken }] = useLocal<
    ModerationRejectedTombstoneContainer_local
  >(graphql`
    fragment ModerationRejectedTombstoneContainer_local on Local {
      accessToken
    }
  `);

  const moderationLinkSuffix =
    !!accessToken &&
    settingsData.auth.integrations.sso.enabled &&
    settingsData.auth.integrations.sso.targetFilter.admin &&
    `#accessToken=${accessToken}`;

  const gotoModerateCommentHref = useMemo(() => {
    let link = getModerationLink({ commentID: commentData.id });
    if (moderationLinkSuffix) {
      link += moderationLinkSuffix;
    }

    return link;
  }, [commentData.id, moderationLinkSuffix]);
  return (
    <Tombstone className={CLASSES.moderationRejectedTombstone.$root} fullWidth>
      <Localized id="comments-moderationRejectedTombstone-title">
        <div>You have rejected this comment.</div>
      </Localized>
      <Button
        variant="flat"
        color="primary"
        underline
        className={CLASSES.moderationRejectedTombstone.goToModerateButton}
        href={gotoModerateCommentHref}
        target="_blank"
      >
        <Flex alignItems="center">
          <Localized id="comments-moderationRejectedTombstone-moderateLink">
            <span>Go to moderate to review this decision</span>
          </Localized>
          <Icon size="sm" className={styles.icon}>
            open_in_new
          </Icon>
        </Flex>
      </Button>
    </Tombstone>
  );
};

export default ModerationRejectedTombstoneContainer;
