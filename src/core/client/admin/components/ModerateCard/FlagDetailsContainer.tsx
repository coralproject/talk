import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { GQLCOMMENT_FLAG_REASON } from "coral-admin/schema";
import { TOXICITY_THRESHOLD_DEFAULT } from "coral-common/constants";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import {
  COMMENT_FLAG_REASON,
  FlagDetailsContainer_comment,
} from "coral-admin/__generated__/FlagDetailsContainer_comment.graphql";
import { FlagDetailsContainer_settings } from "coral-admin/__generated__/FlagDetailsContainer_settings.graphql";

import FlagDetails from "./FlagDetails";
import FlagDetailsCategory from "./FlagDetailsCategory";
import ToxicityLabel from "./ToxicityLabel";

import styles from "./FlagDetailsContainer.css";

interface Reasons<T> {
  offensive: T[];
  abusive: T[];
  spam: T[];
  other: T[];
}

function reduceReasons<
  T extends { readonly reason: COMMENT_FLAG_REASON | null }
>(nodes: ReadonlyArray<T>) {
  const initialValue: Reasons<T> = {
    offensive: [],
    abusive: [],
    spam: [],
    other: [],
  };

  return nodes.reduce((reasons, node) => {
    switch (node.reason) {
      case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE:
        reasons.offensive.push(node);
        break;
      case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_ABUSIVE:
        reasons.abusive.push(node);
        break;
      case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM:
        reasons.spam.push(node);
        break;
      case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OTHER:
        reasons.other.push(node);
        break;
    }

    return reasons;
  }, initialValue);
}

interface Props {
  comment: FlagDetailsContainer_comment;
  settings: FlagDetailsContainer_settings;
  onUsernameClick: (id?: string) => void;
}

const FlagDetailsContainer: FunctionComponent<Props> = ({
  comment,
  onUsernameClick,
  settings,
}) => {
  const { offensive, abusive, spam, other } = useMemo(
    () => reduceReasons(comment.flags.nodes),
    [comment.flags.nodes]
  );

  const metadata = comment.revision ? comment.revision.metadata : null;

  return (
    <HorizontalGutter size="oneAndAHalf">
      <hr className={styles.detailsDivider} />
      {metadata && metadata.perspective && (
        <FlagDetailsCategory
          category={
            <Localized id="moderate-flagDetails-toxicityScore">
              <span>Toxicity Score</span>
            </Localized>
          }
        >
          <ToxicityLabel
            score={metadata.perspective.score}
            threshold={
              settings.integrations.perspective.threshold ||
              TOXICITY_THRESHOLD_DEFAULT / 100
            }
          />
        </FlagDetailsCategory>
      )}
      <FlagDetails
        category={
          <Localized id="moderate-flagDetails-offensive">
            <span>Offensive</span>
          </Localized>
        }
        nodes={offensive}
        onUsernameClick={onUsernameClick}
      />
      <FlagDetails
        category={
          <Localized id="moderate-flagDetails-abusive">
            <span>Abusive</span>
          </Localized>
        }
        nodes={abusive}
        onUsernameClick={onUsernameClick}
      />
      <FlagDetails
        category={
          <Localized id="moderate-flagDetails-spam">
            <span>Spam</span>
          </Localized>
        }
        nodes={spam}
        onUsernameClick={onUsernameClick}
      />
      <FlagDetails
        category={
          <Localized id="moderate-flagDetails-other">
            <span>Other</span>
          </Localized>
        }
        nodes={other}
        onUsernameClick={onUsernameClick}
      />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment FlagDetailsContainer_comment on Comment {
      flags {
        nodes {
          flagger {
            username
            id
          }
          reason
          additionalDetails
        }
      }
      revision {
        metadata {
          perspective {
            score
          }
        }
      }
    }
  `,
  settings: graphql`
    fragment FlagDetailsContainer_settings on Settings {
      integrations {
        perspective {
          threshold
        }
      }
    }
  `,
})(FlagDetailsContainer);

export default enhanced;
