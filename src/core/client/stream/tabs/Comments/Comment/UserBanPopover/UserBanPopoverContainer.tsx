import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql } from "react-relay";

import { useModerationLink } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Box, Button, CallOut, Divider, Flex } from "coral-ui/components/v2";

import { UserBanPopoverContainer_comment } from "coral-stream/__generated__/UserBanPopoverContainer_comment.graphql";
import { UserBanPopoverContainer_local } from "coral-stream/__generated__/UserBanPopoverContainer_local.graphql";
import { UserBanPopoverContainer_settings } from "coral-stream/__generated__/UserBanPopoverContainer_settings.graphql";
import { UserBanPopoverContainer_story } from "coral-stream/__generated__/UserBanPopoverContainer_story.graphql";
import { UserBanPopoverContainer_viewer } from "coral-stream/__generated__/UserBanPopoverContainer_viewer.graphql";

import { ModerationDropdownView } from "../ModerationDropdown/ModerationDropdownContainer";
import RejectCommentMutation from "../ModerationDropdown/RejectCommentMutation";
import { SetSpamBanned } from "../setSpamBanned";
import BanUserMutation from "./BanUserMutation";

import styles from "./UserBanPopoverContainer.css";

interface Props {
  onDismiss: () => void;
  comment: UserBanPopoverContainer_comment;
  settings: UserBanPopoverContainer_settings;
  story: UserBanPopoverContainer_story;
  viewer: UserBanPopoverContainer_viewer;
  view: ModerationDropdownView;
}

const UserBanPopoverContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  story,
  viewer,
  onDismiss,
  view,
}) => {
  const [{ accessToken }] = useLocal<UserBanPopoverContainer_local>(graphql`
    fragment UserBanPopoverContainer_local on Local {
      accessToken
    }
  `);
  const setSpamBanned = useMutation(SetSpamBanned);
  const siteBan = view === "SITE_BAN";

  const user = comment.author!;
  const viewerScoped =
    viewer?.moderationScopes && viewer.moderationScopes.scoped;
  const rejected = comment.status === "REJECTED";
  const reject = useMutation(RejectCommentMutation);
  const banUser = useMutation(BanUserMutation);
  const { localeBundles, rootURL } = useCoralContext();
  const [spamBanConfirmation, setSpamBanConfirmation] = useState("");

  const linkModerateComment = useModerationLink({ commentID: comment.id });
  const linkCommunitySection = rootURL + "/admin/community";

  const adminLinkSuffix =
    !!accessToken &&
    settings.auth.integrations.sso.enabled &&
    settings.auth.integrations.sso.targetFilter.admin &&
    `#accessToken=${accessToken}`;

  const gotoModerateCommentHref = useMemo(() => {
    let ret = linkModerateComment;
    if (adminLinkSuffix) {
      ret += adminLinkSuffix;
    }

    return ret;
  }, [linkModerateComment, adminLinkSuffix]);

  const gotoCommunitySectionHref = useMemo(() => {
    let ret = linkCommunitySection;
    if (adminLinkSuffix) {
      ret += adminLinkSuffix;
    }

    return ret;
  }, [linkCommunitySection, adminLinkSuffix]);

  const onBan = useCallback(async () => {
    try {
      await banUser({
        userID: user.id,
        commentID: comment.id,
        rejectExistingComments: !siteBan,
        message: getMessage(
          localeBundles,
          "common-banEmailTemplate",
          "Someone with access to your account has violated our community guidelines. As a result, your account has been banned. You will no longer be able to comment, react or report comments",
          { username: user.username }
        ),
        siteIDs: siteBan || viewerScoped ? [story.site.id] : [],
      });
      if (!rejected && comment.revision) {
        await reject({
          commentID: comment.id,
          commentRevisionID: comment.revision.id,
          storyID: story.id,
          noEmit: true,
          spamBan: !siteBan,
        });
      }
    } catch (e) {
      // error
    }
    if (siteBan) {
      onDismiss();
    }
  }, [
    user.id,
    user.username,
    comment.id,
    comment.revision,
    localeBundles,
    banUser,
    rejected,
    onDismiss,
    story.site.id,
    story.id,
    reject,
    viewerScoped,
  ]);

  if (view === "CONFIRM_BAN") {
    return (
      <Box className={cn(styles.root, CLASSES.banUserPopover.$root)} p={3}>
        <Localized id="" vars={{ username: user.username }}>
          <div className={styles.title}>{user.username} is now banned</div>
        </Localized>
        <Flex className={styles.container} spacing={2} direction="column">
          <Localized id="">
            <div>
              This account can no longer comment, use reactions, or report
              comments
            </div>
          </Localized>
          <Localized id="">
            <div>All comments by this account have been rejected</div>
          </Localized>
        </Flex>
        <Flex
          justifyContent="flex-end"
          itemGutter="half"
          className={styles.actions}
        >
          <Localized id="">
            <Button
              variant="regular"
              size="regular"
              color="stream"
              onClick={() => setSpamBanned({ commentID: comment.id })}
            >
              Close
            </Button>
          </Localized>
        </Flex>
        <Divider />
        <Flex alignItems="baseline" direction="column">
          <Localized id="">
            <div>
              You can still review this account's history by searching in
              Coral's{" "}
              <Button
                className={styles.link}
                href={gotoCommunitySectionHref}
                variant="text"
                uppercase={false}
                color="stream"
                underline
                size="large"
                target="_blank"
                anchor
              >
                Community section
              </Button>
            </div>
          </Localized>
        </Flex>
      </Box>
    );
  }

  return (
    <Box className={cn(styles.root, CLASSES.banUserPopover.$root)} p={3}>
      {
        <>
          {siteBan ? (
            <Localized
              id="comments-userSiteBanPopover-title"
              vars={{ username: user.username }}
            >
              <div className={styles.title}>
                Ban {user.username} from this site?
              </div>
            </Localized>
          ) : (
            <>
              <Localized id="comments-userSpamBanPopover-title">
                <div className={styles.title}>Spam ban</div>
              </Localized>
              <Localized id="comments-userSpamBanPopover-header-username">
                <div className={styles.header}>Username</div>
              </Localized>
              <div>{user.username}</div>
              <Localized id="comments-userSpamBanPopover-header-description">
                <div className={styles.header}>Spam ban will</div>
              </Localized>
              <div>
                <ol className={styles.orderedList}>
                  <Localized id="comments-userSpamBanPopover-description-list-banFromComments">
                    <li>Ban this account from the comments</li>
                  </Localized>
                  <Localized id="comments-userSpamBanPopover-description-list-rejectAllComments">
                    <li>Reject all comments written by this account</li>
                  </Localized>
                </ol>
              </div>
              <Localized id="comments-userSpamBanPopover-callout">
                <CallOut
                  className={styles.callOut}
                  color="error"
                  fullWidth
                  borderless
                >
                  {/* TODO: Add icon */}
                  Only for use on obvious spam accounts
                </CallOut>
              </Localized>
              <Localized id="comments-userSpamBanPopover-confirmation">
                <div className={styles.header}>
                  Type in "spam ban" to confirm
                </div>
              </Localized>
              <input
                className={styles.confirmationInput}
                type="text"
                placeholder=""
                onChange={(e) => setSpamBanConfirmation(e.target.value)}
              ></input>
            </>
          )}
          <Flex
            justifyContent="flex-end"
            itemGutter="half"
            className={styles.actions}
          >
            <Localized id="comments-userBanPopover-cancel">
              <Button
                className={CLASSES.banUserPopover.cancelButton}
                variant="outlined"
                size="regular"
                color="mono"
                onClick={onDismiss}
              >
                Cancel
              </Button>
            </Localized>
            <Localized id="comments-userBanPopover-ban">
              <Button
                disabled={
                  siteBan ? false : !(spamBanConfirmation === "spam ban")
                }
                className={CLASSES.banUserPopover.banButton}
                variant="regular"
                size="regular"
                color="alert"
                onClick={onBan}
              >
                Ban
              </Button>
            </Localized>
          </Flex>
          {!siteBan && (
            <>
              <Divider />
              <Localized id="">
                <Flex alignItems="baseline">
                  For more context, go to{" "}
                  <Button
                    href={gotoModerateCommentHref}
                    variant="text"
                    uppercase={false}
                    color="stream"
                    underline
                    size="large"
                    target="_blank"
                    anchor
                  >
                    Moderation view
                  </Button>
                </Flex>
              </Localized>
            </>
          )}
        </>
      }
    </Box>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment UserBanPopoverContainer_comment on Comment {
      id
      revision {
        id
      }
      status
      author {
        id
        username
      }
    }
  `,
  story: graphql`
    fragment UserBanPopoverContainer_story on Story {
      id
      site {
        id
        name
      }
    }
  `,
  settings: graphql`
    fragment UserBanPopoverContainer_settings on Settings {
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
  viewer: graphql`
    fragment UserBanPopoverContainer_viewer on User {
      moderationScopes {
        scoped
      }
    }
  `,
})(UserBanPopoverContainer);

export default enhanced;
