import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLCOMMENT_FLAG_REASON } from "coral-framework/schema";
import { HorizontalGutter } from "coral-ui/components/v2";

import {
  COMMENT_FLAG_REASON,
  FlagDetailsContainer_comment,
} from "coral-admin/__generated__/FlagDetailsContainer_comment.graphql";

import FlagDetails from "./FlagDetails";

import styles from "./FlagDetailsContainer.css";

interface Reasons<T> {
  offensive: T[];
  abusive: T[];
  spam: T[];
  bio: T[];
  other: T[];
}

function reduceReasons<
  T extends { readonly reason: COMMENT_FLAG_REASON | null }
>(nodes: ReadonlyArray<T>) {
  const initialValue: Reasons<T> = {
    offensive: [],
    abusive: [],
    spam: [],
    bio: [],
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
      case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_BIO:
        reasons.bio.push(node);
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
  onUsernameClick: (id?: string) => void;
}

const FlagDetailsContainer: FunctionComponent<Props> = ({
  comment,
  onUsernameClick,
}) => {
  const { offensive, abusive, spam, bio, other } = useMemo(
    () => reduceReasons(comment.flags.nodes),
    [comment.flags.nodes]
  );

  return (
    <>
      <Localized id="moderate-flagDetails-latestReports">
        <p className={styles.latestReports}>Latest reports</p>
      </Localized>
      <HorizontalGutter size="oneAndAHalf">
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
            <Localized id="moderate-flagDetails-bio">
              <span>Bio</span>
            </Localized>
          }
          nodes={bio}
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
    </>
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
})(FlagDetailsContainer);

export default enhanced;
