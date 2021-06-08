import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";
import { Marker, Tag } from "coral-ui/components/v2";

import {
  COMMENT_FLAG_REASON,
  COMMENT_STATUS,
  ExternalModerationSummaryContainer_comment,
} from "coral-admin/__generated__/ExternalModerationSummaryContainer_comment.graphql";

import styles from "./ExternalModerationSummaryContainer.css";

interface Props {
  comment: ExternalModerationSummaryContainer_comment;
}

let keyCounter = 0;

interface StatusProps {
  status: COMMENT_STATUS | null;
}

const StatusBadge: FunctionComponent<StatusProps> = ({ status }) => {
  switch (status) {
    case GQLCOMMENT_STATUS.NONE:
      return (
        <Localized id="moderateCardDetails-tab-externalMod-none">
          <Tag color="grey">None</Tag>
        </Localized>
      );
    case GQLCOMMENT_STATUS.APPROVED:
      return (
        <Localized id="moderateCardDetails-tab-externalMod-approved">
          <Tag color="primary">Approved</Tag>
        </Localized>
      );
    case GQLCOMMENT_STATUS.REJECTED:
      return (
        <Localized id="moderateCardDetails-tab-externalMod-rejected">
          <Tag color="error">Rejected</Tag>
        </Localized>
      );
    case GQLCOMMENT_STATUS.PREMOD:
      return (
        <Localized id="moderateCardDetails-tab-externalMod-premod">
          <Tag color="grey">Pre-moderated</Tag>
        </Localized>
      );
    case GQLCOMMENT_STATUS.SYSTEM_WITHHELD:
      return (
        <Localized id="moderateCardDetails-tab-externalMod-systemWithheld">
          <Tag color="grey">System withheld</Tag>
        </Localized>
      );
    default:
      return null;
  }
};

const getReasonMarker = (reason: COMMENT_FLAG_REASON | null) => {
  switch (reason) {
    case "COMMENT_DETECTED_SPAM":
      return (
        <Localized id="moderate-marker-spamDetected">
          <Marker color="reported" key={keyCounter++}>
            Spam Detected
          </Marker>
        </Localized>
      );
    case "COMMENT_DETECTED_TOXIC":
      return (
        <Localized id="moderate-marker-toxic">
          <Marker color="reported" key={keyCounter++}>
            Toxic
          </Marker>
        </Localized>
      );
    default:
      return null;
  }
};

const ExternalModerationSummaryContainer: FunctionComponent<Props> = ({
  comment,
}) => {
  if (
    !comment.revision ||
    !comment.revision.metadata ||
    !comment.revision.metadata.externalModeration
  ) {
    return null;
  }

  const externalModerations = comment.revision.metadata.externalModeration;

  return (
    <>
      {externalModerations.map((em) => {
        return (
          <>
            <div className={styles.name}>{em.name}</div>
            <div className={styles.body}>
              {em.status && (
                <>
                  <Localized id="moderateCardDetails-tab-externalMod-status">
                    <div className={styles.title}>Status</div>
                  </Localized>
                  <div className={styles.section}>
                    <StatusBadge status={em.status} />
                  </div>
                </>
              )}
              {em.actions && em.actions.length > 0 && (
                <>
                  <Localized id="moderateCardDetails-tab-externalMod-flags">
                    <div className={styles.title}>Flags</div>
                  </Localized>
                  <div className={styles.section}>
                    {em.actions?.map((a) => getReasonMarker(a.reason))}
                  </div>
                </>
              )}
              {em.tags && em.tags.length > 0 && (
                <>
                  <Localized id="moderateCardDetails-tab-externalMod-tags">
                    <div className={styles.title}>Tags</div>
                  </Localized>
                  <div className={styles.section}>
                    {em.tags?.map((t) => (
                      <Marker key={keyCounter++}>{t}</Marker>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        );
      })}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ExternalModerationSummaryContainer_comment on Comment {
      revision {
        metadata {
          externalModeration {
            name
            analyzedAt
            status
            tags
            actions {
              reason
            }
          }
        }
      }
    }
  `,
})(ExternalModerationSummaryContainer);

export default enhanced;
