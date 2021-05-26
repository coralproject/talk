import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import NotAvailable from "coral-admin/components/NotAvailable";
import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import getModerationLink from "coral-framework/helpers/getModerationLink";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  CheckBox,
  TableCell,
  TableRow,
  TextLink,
} from "coral-ui/components/v2";
import { TimestampFormatter } from "coral-ui/components/v2/Timestamp";

import {
  COMMENT_FLAG_REASON,
  ForReviewQueueRowContainer_flag,
} from "coral-admin/__generated__/ForReviewQueueRowContainer_flag.graphql";

import { MarkFlagReviewedMutation } from "./MarkFlagReviewedMutation";

import styles from "./ForReviewQueueRowContainer.css";

interface Props {
  flag: ForReviewQueueRowContainer_flag;
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

const ForReviewQueueRowContainer: FunctionComponent<Props> = ({ flag }) => {
  const markFlagged = useMutation(MarkFlagReviewedMutation);
  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void markFlagged({ id: flag.id, reviewed: event.currentTarget.checked });
  };

  return (
    <TableRow>
      <TableCell className={styles.column}>
        <TimestampFormatter>{flag.createdAt}</TimestampFormatter>
      </TableCell>
      <TableCell className={styles.column}>
        <div className={styles.commentContainer}>
          <Link
            as={TextLink}
            to={getModerationLink({ commentID: flag.comment.id })}
          >
            {getHTMLPlainText(flag.revision?.body || "")
              .trim()
              .substr(0, 50) || "No text content"}
          </Link>
        </div>
      </TableCell>
      <TableCell className={styles.column}>
        <div className={styles.reportedByContainer}>
          {flag.flagger?.username || <NotAvailable />}
        </div>
      </TableCell>
      <TableCell className={styles.column}>
        <ReasonText reason={flag.reason} />
      </TableCell>
      <TableCell className={styles.descriptionColumn}>
        {flag.additionalDetails}
      </TableCell>
      <TableCell className={styles.reviewedColumn} align="center">
        <CheckBox checked={flag.reviewed} onChange={handleCheckBoxChange} />
      </TableCell>
    </TableRow>
  );
};

const enhanced = withFragmentContainer<Props>({
  flag: graphql`
    fragment ForReviewQueueRowContainer_flag on Flag {
      id
      createdAt
      flagger {
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
      }
      revision {
        body
      }
    }
  `,
})(ForReviewQueueRowContainer);

export default enhanced;
