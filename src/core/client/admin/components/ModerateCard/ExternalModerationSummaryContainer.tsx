import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Marker } from "coral-ui/components/v2";

import {
  COMMENT_FLAG_REASON,
  ExternalModerationSummaryContainer_comment,
} from "coral-admin/__generated__/ExternalModerationSummaryContainer_comment.graphql";

import styles from "./ExternalModerationSummaryContainer.css";

interface Props {
  comment: ExternalModerationSummaryContainer_comment;
}

let keyCounter = 0;
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

  return (
    <>
      {comment.revision.metadata.externalModeration.map((em) => {
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
                    <Marker>{em.status}</Marker>
                  </div>
                </>
              )}
              {em.actions && em.actions.length > 0 && (
                <>
                  <Localized id="moderateCardDetails-tab-externalMod-actions">
                    <div className={styles.title}>Actions</div>
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
