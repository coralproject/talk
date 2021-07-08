import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { TOXICITY_THRESHOLD_DEFAULT } from "coral-common/constants";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";
import { Flex, Marker, Tag } from "coral-ui/components/v2";

import {
  COMMENT_FLAG_REASON,
  COMMENT_STATUS,
  ExternalModerationSummaryContainer_comment,
} from "coral-admin/__generated__/ExternalModerationSummaryContainer_comment.graphql";
import { ExternalModerationSummaryContainer_settings } from "coral-admin/__generated__/ExternalModerationSummaryContainer_settings.graphql";

import FlagDetailsCategory from "./FlagDetailsCategory";
import ToxicityLabel from "./ToxicityLabel";

import styles from "./ExternalModerationSummaryContainer.css";

interface Props {
  comment: ExternalModerationSummaryContainer_comment;
  settings: ExternalModerationSummaryContainer_settings;
}

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

interface ReasonMarkerProps {
  reason: COMMENT_FLAG_REASON | null;
}

const ReasonMarker: FunctionComponent<ReasonMarkerProps> = ({ reason }) => {
  switch (reason) {
    case "COMMENT_DETECTED_SPAM":
      return (
        <Localized id="moderate-marker-spamDetected">
          <Marker color="reported">Spam Detected</Marker>
        </Localized>
      );
    case "COMMENT_DETECTED_TOXIC":
      return (
        <Localized id="moderate-marker-toxic">
          <Marker color="reported">Toxic</Marker>
        </Localized>
      );
    default:
      return null;
  }
};

const ExternalModerationSummaryContainer: FunctionComponent<Props> = ({
  comment,
  settings,
}) => {
  if (
    !comment.revision ||
    !comment.revision.metadata ||
    !comment.revision.metadata.externalModeration
  ) {
    return null;
  }

  const externalModerations = comment.revision.metadata.externalModeration.map(
    (em) => {
      return { ...em, missing: false };
    }
  );

  const missingPhases = (
    settings.integrations?.external?.phases?.filter((p) => {
      return !externalModerations.find((em) => em.name === p.name);
    }) || []
  ).map((p) => {
    return {
      name: p.name,
      result: {
        status: null,
        actions: null,
        tags: null,
      },
      missing: true,
    };
  });

  const phases = [...externalModerations, ...missingPhases];

  return (
    <>
      {comment.revision.metadata && comment.revision.metadata.perspective && (
        <FlagDetailsCategory
          category={
            <Localized id="moderate-flagDetails-toxicityScore">
              <span>Toxicity Score</span>
            </Localized>
          }
        >
          <ToxicityLabel
            score={comment.revision.metadata.perspective.score}
            threshold={
              settings.integrations.perspective.threshold ||
              TOXICITY_THRESHOLD_DEFAULT / 100
            }
          />
        </FlagDetailsCategory>
      )}
      {phases.map((em) => {
        return (
          <>
            <div className={styles.name}>{em.name}</div>
            <div className={styles.body}>
              {em.result.status && (
                <div className={styles.section}>
                  <Localized id="moderateCardDetails-tab-externalMod-status">
                    <span className={styles.title}>Status</span>
                  </Localized>
                  <StatusBadge status={em.result.status} />
                </div>
              )}
              {em.result.actions && em.result.actions.length > 0 && (
                <Flex spacing={2} className={styles.section}>
                  <Localized id="moderateCardDetails-tab-externalMod-flags">
                    <span className={styles.title}>Flags</span>
                  </Localized>
                  {em.result.actions?.map((a, i) => (
                    <ReasonMarker key={`action-${i}`} reason={a.reason} />
                  ))}
                </Flex>
              )}
              {em.result.tags && em.result.tags.length > 0 && (
                <Flex spacing={2} className={styles.section}>
                  <Localized id="moderateCardDetails-tab-externalMod-tags">
                    <span className={styles.title}>Tags</span>
                  </Localized>
                  {em.result.tags?.map((t, i) => (
                    <Marker key={`tag-${i}`}>{t}</Marker>
                  ))}
                </Flex>
              )}
              {em.missing && (
                <Localized id="moderateCardDetails-tab-missingPhase">
                  <span className={styles.title}>Was not run</span>
                </Localized>
              )}
              {!em.missing &&
                !em.result.status &&
                (!em.result.tags || em.result.tags.length === 0) &&
                (!em.result.actions || em.result.actions.length === 0) && (
                  <Localized id="moderateCardDetails-tab-noIssuesFound">
                    <span className={styles.title}>No issues found</span>
                  </Localized>
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
          perspective {
            score
          }
          externalModeration {
            name
            analyzedAt
            result {
              status
              tags
              actions {
                reason
              }
            }
          }
        }
      }
    }
  `,
  settings: graphql`
    fragment ExternalModerationSummaryContainer_settings on Settings {
      integrations {
        perspective {
          threshold
        }
        external {
          phases {
            name
          }
        }
      }
    }
  `,
})(ExternalModerationSummaryContainer);

export default enhanced;
