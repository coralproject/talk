import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { useModerationLink } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { useStreamLocal } from "coral-stream/local/StreamLocal";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button, Tombstone } from "coral-ui/components/v3";

import { ModerationRejectedTombstoneContainer_comment as CommentData } from "coral-stream/__generated__/ModerationRejectedTombstoneContainer_comment.graphql";
import { ModerationRejectedTombstoneContainer_settings as SettingsData } from "coral-stream/__generated__/ModerationRejectedTombstoneContainer_settings.graphql";

import styles from "./ModerationRejectedTombstoneContainer.css";

interface Props {
  comment: CommentData;
  settings: SettingsData;
}

const ModerationRejectedTombstoneContainer: FunctionComponent<Props> = ({
  comment,
  settings,
}) => {
  const { accessToken } = useStreamLocal();

  const link = useModerationLink({ commentID: comment.id });
  const moderationLinkSuffix =
    !!accessToken &&
    settings.auth.integrations.sso.enabled &&
    settings.auth.integrations.sso.targetFilter.admin &&
    `#accessToken=${accessToken}`;

  const gotoModerateCommentHref = useMemo(() => {
    let ret = link;
    if (moderationLinkSuffix) {
      ret += moderationLinkSuffix;
    }

    return ret;
  }, [link, moderationLinkSuffix]);
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

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerationRejectedTombstoneContainer_comment on Comment {
      id
    }
  `,
  settings: graphql`
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
})(ModerationRejectedTombstoneContainer);

export default enhanced;
