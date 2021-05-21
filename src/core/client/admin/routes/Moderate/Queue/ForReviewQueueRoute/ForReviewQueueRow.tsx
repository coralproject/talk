import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CommentParser from "coral-admin/components/Comment/CommentParser";
import { getLocationOrigin } from "coral-framework/utils";
import { CheckBox, Flex, TableCell, TableRow } from "coral-ui/components/v2";
import { TimestampFormatter } from "coral-ui/components/v2/Timestamp";
import { ComponentLink } from "coral-ui/components/v3";

import { COMMENT_FLAG_REASON } from "coral-admin/__generated__/ForReviewQueueRoute_query.graphql";

import styles from "./ForReviewQueueRow.css";

interface ForReviewRevision {
  readonly body: string | null;
}

interface ForReviewComment {
  id: string;
  revision: ForReviewRevision;
}

interface Props {
  id: string;
  comment: ForReviewComment | null;
  username: string | null;
  reason: COMMENT_FLAG_REASON | null;
  additionalDetails: string | null;
  createdAt: string;
  reviewed: boolean;
  onReview: (id: string, enabled: boolean) => void;
}

const getRevision = (comment: ForReviewComment | null) => {
  if (!comment) {
    return "";
  }

  if (!comment.revision) {
    return "";
  }

  return comment.revision.body || "";
};

const getModerationURL = (comment: ForReviewComment | null) => {
  if (!comment) {
    return "";
  }

  return `${getLocationOrigin()}/admin/moderate/comment/${comment.id}`;
};

interface ReasonTextProps {
  reason: COMMENT_FLAG_REASON | null;
}

const ReasonText: FunctionComponent<ReasonTextProps> = ({ reason }) => {
  if (!reason) {
    return null;
  }

  switch (reason) {
    case "COMMENT_DETECTED_BANNED_WORD":
      return (
        <Localized id="forReview-detectedBannedWord">Banned word</Localized>
      );
    case "COMMENT_DETECTED_LINKS":
      return <Localized id="forReview-detectedLinks">Detected links</Localized>;
    case "COMMENT_DETECTED_NEW_COMMENTER":
      return (
        <Localized id="forReview-detectedNewCommenter">New commenter</Localized>
      );
    case "COMMENT_DETECTED_PREMOD_USER":
      return (
        <Localized id="forReview-detectedPremodUser">
          Pre-moderated username
        </Localized>
      );
    case "COMMENT_DETECTED_RECENT_HISTORY":
      return (
        <Localized id="forReview-detectedRecentHistory">
          Recent history
        </Localized>
      );
    case "COMMENT_DETECTED_REPEAT_POST":
      return (
        <Localized id="forReview-detectedRepeatPost">Repeat post</Localized>
      );
    case "COMMENT_DETECTED_SPAM":
      return <Localized id="forReview-detectedSpam">Detected spam</Localized>;
    case "COMMENT_DETECTED_SUSPECT_WORD":
      return (
        <Localized id="forReview-detectedSuspectWord">Suspect word</Localized>
      );
    case "COMMENT_DETECTED_TOXIC":
      return <Localized id="forReview-detectedToxic">Toxic</Localized>;
    case "COMMENT_REPORTED_ABUSIVE":
      return <Localized id="forReview-reportedAbusive">Abusive</Localized>;
    case "COMMENT_REPORTED_BIO":
      return <Localized id="forReview-reportedBio">User bio</Localized>;
    case "COMMENT_REPORTED_OFFENSIVE":
      return <Localized id="forReview-reportedOffensive">Offensive</Localized>;
    case "COMMENT_REPORTED_OTHER":
      return <Localized id="forReview-reportedOther">Other</Localized>;
    case "COMMENT_REPORTED_SPAM":
      return <Localized id="forReview-reportedSpam">Spam</Localized>;
    default:
      return null;
  }
};

const ForReviewQueueRow: FunctionComponent<Props> = ({
  id,
  comment,
  username,
  reason,
  additionalDetails,
  createdAt,
  onReview,
  reviewed,
}) => {
  return (
    <TableRow>
      <TableCell>
        <TimestampFormatter>{createdAt}</TimestampFormatter>
      </TableCell>
      <TableCell>
        {
          <ComponentLink href={getModerationURL(comment)}>
            <CommentParser className={styles.commentLink}>
              {getRevision(comment)}
            </CommentParser>
          </ComponentLink>
        }
      </TableCell>
      <TableCell>{username}</TableCell>
      <TableCell>
        <ReasonText reason={reason} />
      </TableCell>
      <TableCell>{additionalDetails}</TableCell>
      <TableCell>
        <Flex alignItems="center" justifyContent="space-evenly">
          <CheckBox
            checked={reviewed}
            onChange={(event) => {
              const enabled = !!(event.currentTarget.value === "on");
              void onReview(id, enabled);
            }}
          >
            {""}
          </CheckBox>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

export default ForReviewQueueRow;
