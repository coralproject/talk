import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import CommentParser from "coral-admin/components/Comment/CommentParser";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { getLocationOrigin } from "coral-framework/utils";
import {
  CheckBox,
  Flex,
  TableCell,
  TableRow,
  TextLink,
} from "coral-ui/components/v2";
import { TimestampFormatter } from "coral-ui/components/v2/Timestamp";

import {
  COMMENT_FLAG_REASON,
  ForReviewQueueRow_flag,
} from "coral-admin/__generated__/ForReviewQueueRow_flag.graphql";

import styles from "./ForReviewQueueRow.css";

interface Props {
  onReview: (id: string, enabled: boolean) => void;
  flag: ForReviewQueueRow_flag;
}

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

const ForReviewQueueRow: FunctionComponent<Props> = ({ onReview, flag }) => {
  return (
    <TableRow>
      <TableCell>
        <TimestampFormatter>{flag.createdAt}</TimestampFormatter>
      </TableCell>
      <TableCell>
        {
          <TextLink
            href={`${getLocationOrigin()}/admin/moderate/comment/${
              flag.comment.id
            }`}
          >
            <CommentParser className={styles.commentLink}>
              {flag.revision ? flag.revision.body || "" : ""}
            </CommentParser>
          </TextLink>
        }
      </TableCell>
      <TableCell>{flag.flagger ? flag.flagger.username : ""}</TableCell>
      <TableCell>
        <ReasonText reason={flag.reason} />
      </TableCell>
      <TableCell>{flag.additionalDetails}</TableCell>
      <TableCell>
        <Flex alignItems="center" justifyContent="space-evenly">
          <CheckBox
            checked={flag.reviewed}
            onChange={(event) => {
              const enabled = !!(event.currentTarget.value === "on");
              void onReview(flag.id, enabled);
            }}
          >
            {""}
          </CheckBox>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

const enhanced = withFragmentContainer<Props>({
  flag: graphql`
    fragment ForReviewQueueRow_flag on Flag {
      id
      createdAt
      flagger {
        id
        username
      }
      reason
      additionalDetails
      reviewed
      revision {
        body
      }
      comment {
        id
        story {
          id
        }
      }
      revision {
        body
      }
    }
  `,
})(ForReviewQueueRow);

export default enhanced;
