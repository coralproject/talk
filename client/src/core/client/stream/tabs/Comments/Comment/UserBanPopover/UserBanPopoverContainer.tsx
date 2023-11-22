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
import { GQLREJECTION_REASON_CODE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  SvgIcon,
} from "coral-ui/components/icons";
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
  const { localeBundles, rootURL } = useCoralContext();
  const setSpamBanned = useMutation(SetSpamBanned);
  const reject = useMutation(RejectCommentMutation);
  const banUser = useMutation(BanUserMutation);

  const siteBan = view === "SITE_BAN";
  const spamBanConfirmationText = "spam";

  const user = comment.author!;
  const viewerScoped =
    viewer?.moderationScopes && viewer.moderationScopes.scoped;
  const rejected = comment.status === "REJECTED";

  const [spamBanConfirmationTextInput, setSpamBanConfirmationTextInput] =
    useState("");
  const [banError, setBanError] = useState<string | null>(null);

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

  const onCloseConfirm = useCallback(() => {
    void setSpamBanned({ commentID: comment.id, spamBanned: false });
  }, [setSpamBanned, comment.id]);

  const onSpamBanConfirmationTextInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSpamBanConfirmationTextInput(e.target.value);
    },
    [setSpamBanConfirmationTextInput]
  );

  const banButtonDisabled = useMemo(() => {
    return siteBan
      ? false
      : !(
          spamBanConfirmationTextInput.toLowerCase() === spamBanConfirmationText
        );
  }, [siteBan, spamBanConfirmationText, spamBanConfirmationTextInput]);

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
          reason: {
            code: GQLREJECTION_REASON_CODE.OTHER,
            detailedExplanation: getMessage(
              localeBundles,
              "common-userBanned",
              "User was banned."
            ),
          },
        });
      }
    } catch (e) {
      if (e.message) {
        setBanError(e.message);
      }
    }
    if (siteBan) {
      onDismiss();
    } else {
      // this will trigger the spam ban confirmation view to show for this comment
      void setSpamBanned({ commentID: comment.id, spamBanned: true });
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
    setBanError,
    siteBan,
    setSpamBanned,
  ]);

  if (view === "CONFIRM_BAN") {
    return (
      <Box className={cn(styles.root, CLASSES.banUserPopover.$root)} p={3}>
        <Localized
          id="comments-userSiteBanPopover-confirm-title"
          vars={{ username: user.username }}
        >
          <div className={styles.title}>{user.username} is now banned</div>
        </Localized>
        <Flex className={styles.container} spacing={2} direction="column">
          <Localized id="comments-userSiteBanPopover-confirm-spam-banned">
            <div>
              This account can no longer comment, use reactions, or report
              comments
            </div>
          </Localized>
          <Localized id="comments-userSiteBanPopover-confirm-comments-rejected">
            <div>All comments by this account have been rejected</div>
          </Localized>
        </Flex>
        <Flex
          justifyContent="flex-end"
          itemGutter="half"
          className={styles.actions}
        >
          <Localized id="comments-userSiteBanPopover-confirm-closeButton">
            <Button
              variant="regular"
              size="regular"
              color="stream"
              onClick={onCloseConfirm}
            >
              Close
            </Button>
          </Localized>
        </Flex>
        <Divider />
        <Flex alignItems="baseline" direction="column">
          <div>
            <Localized id="comments-userSiteBanPopover-confirm-reviewAccountHistory">
              <span>
                You can still review this account's history by searching in
                Coral's
              </span>
            </Localized>{" "}
            <Localized id="comments-userSiteBanPopover-confirm-communitySection">
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
            </Localized>
          </div>
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
              <CallOut
                className={styles.callOut}
                color="error"
                fullWidth
                borderless
              >
                <SvgIcon
                  size="xs"
                  className={styles.icon}
                  Icon={AlertTriangleIcon}
                />
                <Localized id="comments-userSpamBanPopover-callout">
                  <span>Only for use on obvious spam accounts</span>
                </Localized>
              </CallOut>
              <Localized
                id="comments-userSpamBanPopover-confirmation"
                vars={{ text: spamBanConfirmationText }}
              >
                <div className={styles.header}>
                  Type in "{spamBanConfirmationText}" to confirm
                </div>
              </Localized>
              <input
                data-testid="userSpamBanConfirmation"
                className={styles.confirmationInput}
                type="text"
                placeholder=""
                onChange={onSpamBanConfirmationTextInputChange}
              />
              {banError && (
                <div className={styles.error}>
                  <SvgIcon Icon={AlertCircleIcon} className={styles.icon} />
                  {banError}
                </div>
              )}
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
                disabled={banButtonDisabled}
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
              <Flex alignItems="baseline">
                <Localized id="comments-userBanPopover-moreContext">
                  <span>For more context, go to</span>
                </Localized>{" "}
                <Localized id="comments-userBanPopover-moderationView">
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
                </Localized>
              </Flex>
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
