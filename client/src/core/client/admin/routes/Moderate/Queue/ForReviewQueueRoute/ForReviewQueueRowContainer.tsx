import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import None from "coral-admin/components/None";
import NotAvailable from "coral-admin/components/NotAvailable";
import NoTextContent from "coral-admin/components/NoTextContent";
import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import getModerationLink from "coral-framework/helpers/getModerationLink";
import useDateTimeFormatter from "coral-framework/hooks/useDateTimeFormatter";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { TableCell, TableRow, TextLink } from "coral-ui/components/v2";

import {
  COMMENT_FLAG_REASON,
  ForReviewQueueRowContainer_flag,
} from "coral-admin/__generated__/ForReviewQueueRowContainer_flag.graphql";

import { MarkFlagReviewedMutation } from "./MarkFlagReviewedMutation";

import styles from "./ForReviewQueueRowContainer.css";
import ReviewButton from "./ReviewButton";

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
        <Localized id="moderate-forReview-detectedBannedWord">
          Banned word
        </Localized>
      );
    case "COMMENT_DETECTED_LINKS":
      return (
        <Localized id="moderate-forReview-detectedLinks">
          Detected links
        </Localized>
      );
    case "COMMENT_DETECTED_NEW_COMMENTER":
      return (
        <Localized id="moderate-forReview-detectedNewCommenter">
          New commenter
        </Localized>
      );
    case "COMMENT_DETECTED_PREMOD_USER":
      return (
        <Localized id="moderate-forReview-detectedPremodUser">
          Pre-moderated username
        </Localized>
      );
    case "COMMENT_DETECTED_RECENT_HISTORY":
      return (
        <Localized id="moderate-forReview-detectedRecentHistory">
          Recent history
        </Localized>
      );
    case "COMMENT_DETECTED_REPEAT_POST":
      return (
        <Localized id="moderate-forReview-detectedRepeatPost">
          Repeat post
        </Localized>
      );
    case "COMMENT_DETECTED_SPAM":
      return (
        <Localized id="moderate-forReview-detectedSpam">
          Detected spam
        </Localized>
      );
    case "COMMENT_DETECTED_SUSPECT_WORD":
      return (
        <Localized id="moderate-forReview-detectedSuspectWord">
          Suspect word
        </Localized>
      );
    case "COMMENT_DETECTED_TOXIC":
      return <Localized id="moderate-forReview-detectedToxic">Toxic</Localized>;
    case "COMMENT_REPORTED_ABUSIVE":
      return (
        <Localized id="moderate-forReview-reportedAbusive">Abusive</Localized>
      );
    case "COMMENT_REPORTED_BIO":
      return (
        <Localized id="moderate-forReview-reportedBio">User bio</Localized>
      );
    case "COMMENT_REPORTED_OFFENSIVE":
      return (
        <Localized id="moderate-forReview-reportedOffensive">
          Offensive
        </Localized>
      );
    case "COMMENT_REPORTED_OTHER":
      return <Localized id="moderate-forReview-reportedOther">Other</Localized>;
    case "COMMENT_REPORTED_SPAM":
      return <Localized id="moderate-forReview-reportedSpam">Spam</Localized>;
    default:
      return null;
  }
};

const ForReviewQueueRowContainer: FunctionComponent<Props> = ({ flag }) => {
  const markFlagged = useMutation(MarkFlagReviewedMutation);
  const handleReviewButtonClick = () => {
    void markFlagged({ id: flag.id });
  };

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const username = flag.flagger?.username || "";
  const usernameTitle = username.length >= 20 ? username : undefined;

  return (
    <TableRow data-testid={`moderate-flag-${flag.id}`}>
      <TableCell className={styles.timeColumn}>
        {formatter(flag.createdAt)}
      </TableCell>
      <TableCell className={styles.column}>
        <div className={styles.commentContainer}>
          <Link
            as={TextLink}
            to={getModerationLink({ commentID: flag.comment.id })}
          >
            {flag.revision === null ? (
              <NotAvailable />
            ) : (
              getHTMLPlainText(flag.revision?.body || "")
                .trim()
                .substr(0, 40) || <NoTextContent />
            )}
          </Link>
        </div>
      </TableCell>
      <TableCell className={styles.column}>
        <div className={styles.reportedByContainer} title={usernameTitle}>
          {username || <NotAvailable />}
        </div>
      </TableCell>
      <TableCell className={styles.column}>
        <ReasonText reason={flag.reason} />
      </TableCell>
      <TableCell className={styles.descriptionColumn}>
        {flag.additionalDetails || <None />}
      </TableCell>
      <TableCell className={styles.reviewedColumn} align="center">
        <ReviewButton
          checked={flag.reviewed}
          readOnly={flag.reviewed}
          onClick={handleReviewButtonClick}
        />
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
