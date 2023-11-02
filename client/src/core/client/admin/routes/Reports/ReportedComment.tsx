import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  CommentContent,
  InReplyTo,
  UsernameButton,
} from "coral-admin/components/Comment";
import { MediaContainer } from "coral-admin/components/MediaContainer";
import CommentAuthorContainer from "coral-admin/components/ModerateCard/CommentAuthorContainer";
import NotAvailable from "coral-admin/components/NotAvailable";
import {
  getModerationLink,
  getURLWithCommentID,
} from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  Flex,
  HorizontalGutter,
  Timestamp,
} from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import { ReportedComment_dsaReport } from "coral-admin/__generated__/ReportedComment_dsaReport.graphql";

import styles from "./ReportedComment.css";

interface Props {
  dsaReport: ReportedComment_dsaReport;
  onShowUserDrawer: (userID?: string) => void;
}

const ReportedComment: FunctionComponent<Props> = ({
  dsaReport,
  onShowUserDrawer,
}) => {
  const { comment } = dsaReport;
  const inReplyTo = comment && comment.parent && comment.parent.author;

  // TODO: Maybe show something like Comment not available in this case
  if (!comment) {
    return null;
  }

  return (
    <Flex direction="column">
      <Flex direction="column" className={styles.commentMain}>
        <Localized id="reports-singleReport-comment">
          <div className={styles.label}>Comment</div>
        </Localized>
        <>
          {comment.deleted ? (
            <div>
              This comment is no longer available. The commenter has deleted
              their account.
            </div>
          ) : (
            <>
              <Flex className={styles.commentBox}>
                <div>
                  <div>
                    <Flex alignItems="center">
                      {comment.author?.username && (
                        <>
                          <UsernameButton
                            className={styles.commentUsernameButton}
                            username={comment.author.username}
                            onClick={() => onShowUserDrawer(comment.author?.id)}
                          />
                          <CommentAuthorContainer comment={comment} />
                        </>
                      )}
                      <Timestamp>{comment.createdAt}</Timestamp>
                      {comment.editing.edited && (
                        <Localized id="reports-singleReport-comment-edited">
                          <span className={styles.edited}>(edited)</span>
                        </Localized>
                      )}
                    </Flex>
                    {inReplyTo && inReplyTo.username && (
                      <InReplyTo
                        className={styles.reportUsername}
                        onUsernameClick={() => onShowUserDrawer(inReplyTo.id)}
                      >
                        {inReplyTo.username}
                      </InReplyTo>
                    )}
                  </div>
                  {comment.rating && (
                    <div>
                      <StarRating rating={comment.rating} />
                    </div>
                  )}
                  <div>
                    <div>
                      {/* TODO: Do we want to show message for deleted/rejected */}
                      <CommentContent className={styles.commentContent}>
                        {comment.body || ""}
                      </CommentContent>
                      <MediaContainer comment={comment} />
                    </div>
                  </div>
                  <div>
                    <HorizontalGutter spacing={3}>
                      <div>
                        <div>
                          <Localized id="reports-singleReport-commentOn">
                            <span className={styles.label}>Comment on</span>
                          </Localized>
                          <span>:</span>
                        </div>
                        <div>
                          <span className={styles.storyTitle}>
                            {comment.story?.metadata?.title ?? <NotAvailable />}
                          </span>
                        </div>
                      </div>
                    </HorizontalGutter>
                  </div>
                </div>
              </Flex>
              {/* TODO: Localize these comment links */}
              <Flex marginTop={2}>
                <Button
                  variant="text"
                  uppercase={false}
                  color="mono"
                  to={getURLWithCommentID(comment.story.url, comment.id)}
                  target="_blank"
                >
                  View comment in stream
                </Button>
              </Flex>
              <Flex marginTop={2}>
                <Button
                  variant="text"
                  uppercase={false}
                  color="mono"
                  target="_blank"
                  to={getModerationLink({
                    commentID: comment.id,
                  })}
                >
                  View comment in moderation
                </Button>
              </Flex>
            </>
          )}
        </>
      </Flex>
    </Flex>
  );
};

const enhanced = withFragmentContainer<Props>({
  dsaReport: graphql`
    fragment ReportedComment_dsaReport on DSAReport {
      id
      comment {
        id
        deleted
        parent {
          author {
            id
            username
          }
        }
        author {
          id
          username
        }
        createdAt
        editing {
          edited
        }
        rating
        body
        story {
          url
          metadata {
            title
          }
        }
        ...CommentAuthorContainer_comment
        ...MediaContainer_comment
      }
    }
  `,
})(ReportedComment);

export default enhanced;
