import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { CommentContent } from "coral-admin/components/Comment";
import { getLocationOrigin } from "coral-framework/utils";
import {
  CheckBox,
  TableCell,
  TableRow,
  Timestamp,
} from "coral-ui/components/v2";
import { ComponentLink } from "coral-ui/components/v3";

import { COMMENT_FLAG_REASON } from "coral-admin/__generated__/ForReviewQueueRoute_query.graphql";

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

const getReasonText = (reason: COMMENT_FLAG_REASON | null) => {
  if (!reason) {
    return "";
  }

  if (reason === "COMMENT_DETECTED_BANNED_WORD") {
    return (
      <Localized id="forReview-detectedBannedWord">
        Detected banned word
      </Localized>
    );
  } else if (reason === "COMMENT_DETECTED_LINKS") {
    return <Localized id="forReview-detectedLinks">Detected links</Localized>;
  } else if (reason === "COMMENT_DETECTED_NEW_COMMENTER") {
    return (
      <Localized id="forReview-detectedNewCommenter">
        Detected new commenter
      </Localized>
    );
  } else if (reason === "COMMENT_DETECTED_PREMOD_USER") {
    return (
      <Localized id="forReview-detectedPremodUser">
        Detected pre-moderated username
      </Localized>
    );
  } else if (reason === "COMMENT_DETECTED_RECENT_HISTORY") {
    return (
      <Localized id="forReview-detectedRecentHistory">
        Detected problematic recent history
      </Localized>
    );
  } else if (reason === "COMMENT_DETECTED_REPEAT_POST") {
    return (
      <Localized id="forReview-detectedRepeatPost">
        Detected a repeat post
      </Localized>
    );
  } else if (reason === "COMMENT_DETECTED_SPAM") {
    return <Localized id="forReview-detectedSpam">Detected spam</Localized>;
  } else if (reason === "COMMENT_DETECTED_SUSPECT_WORD") {
    return (
      <Localized id="forReview-detectedSuspectWord">
        Detected a suspect word
      </Localized>
    );
  } else if (reason === "COMMENT_DETECTED_TOXIC") {
    return (
      <Localized id="forReview-detectedToxic">
        Detected toxic language
      </Localized>
    );
  } else if (reason === "COMMENT_REPORTED_ABUSIVE") {
    return (
      <Localized id="forReview-reportedAbusive">Reported abusive</Localized>
    );
  } else if (reason === "COMMENT_REPORTED_BIO") {
    return <Localized id="forReview-reportedBio">Reported user bio</Localized>;
  } else if (reason === "COMMENT_REPORTED_OFFENSIVE") {
    return (
      <Localized id="forReview-reportedOffensive">
        Reported offensive language
      </Localized>
    );
  } else if (reason === "COMMENT_REPORTED_OTHER") {
    return (
      <Localized id="forReview-reportedOther">Other reported reason</Localized>
    );
  } else if (reason === "COMMENT_REPORTED_SPAM") {
    return <Localized id="forReview-reportedSpam">Reported spam</Localized>;
  }

  return "";
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
  const computedReason = useMemo(() => {
    return getReasonText(reason);
  }, [reason]);

  return (
    <TableRow>
      <TableCell>
        <Timestamp>{createdAt}</Timestamp>
      </TableCell>
      <TableCell>
        {
          <ComponentLink href={getModerationURL(comment)}>
            <CommentContent>{getRevision(comment)}</CommentContent>
          </ComponentLink>
        }
      </TableCell>
      <TableCell>{username}</TableCell>
      <TableCell>{computedReason}</TableCell>
      <TableCell>{additionalDetails}</TableCell>
      <TableCell>
        <CheckBox
          checked={reviewed}
          onChange={(event) => {
            const enabled = !!(event.currentTarget.value === "on");
            void onReview(id, enabled);
          }}
        >
          {""}
        </CheckBox>
      </TableCell>
    </TableRow>
  );
};

export default ForReviewQueueRow;
