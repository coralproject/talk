import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import NotAvailable from "coral-admin/components/NotAvailable";
import { TOXICITY_THRESHOLD_DEFAULT } from "coral-common/constants";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLCOMMENT_FLAG_REASON } from "coral-framework/schema";
import { HorizontalGutter } from "coral-ui/components/v2";

import { FlagDetailsContainer_comment } from "coral-admin/__generated__/FlagDetailsContainer_comment.graphql";
import { FlagDetailsContainer_settings } from "coral-admin/__generated__/FlagDetailsContainer_settings.graphql";

import FlagDetailsCategory from "./FlagDetailsCategory";
import FlagDetailsEntry from "./FlagDetailsEntry";
import ToxicityLabel from "./ToxicityLabel";

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
  const metadata = comment.revision ? comment.revision.metadata : null;
  const nodes = comment.flags.nodes;

  const offensive = nodes.filter(
    ({ reason }) => reason === GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE
  );
  const abusive = nodes.filter(
    ({ reason }) => reason === GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_ABUSIVE
  );
  const spam = nodes.filter(
    ({ reason }) => reason === GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM
  );

  return (
    <HorizontalGutter size="oneAndAHalf">
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
      {offensive.length > 0 && (
        <FlagDetailsCategory
          category={
            <Localized id="moderate-flagDetails-offensive">
              <span>Offensive</span>
            </Localized>
          }
        >
          {offensive.map((flag, i) => (
            <FlagDetailsEntry
              key={i}
              onClick={() =>
                flag.flagger ? onUsernameClick(flag.flagger.id) : null
              }
              user={flag.flagger ? flag.flagger.username : <NotAvailable />}
              details={flag.additionalDetails}
            />
          ))}
        </FlagDetailsCategory>
      )}
      {abusive.length > 0 && (
        <FlagDetailsCategory
          category={
            <Localized id="moderate-flagDetails-abusive">
              <span>Abusive</span>
            </Localized>
          }
        >
          {offensive.map((flag, i) => (
            <FlagDetailsEntry
              key={i}
              onClick={() =>
                flag.flagger ? onUsernameClick(flag.flagger.id) : null
              }
              user={flag.flagger ? flag.flagger.username : <NotAvailable />}
              details={flag.additionalDetails}
            />
          ))}
        </FlagDetailsCategory>
      )}
      {spam.length > 0 && (
        <FlagDetailsCategory
          category={
            <Localized id="moderate-flagDetails-spam">
              <span>Spam</span>
            </Localized>
          }
        >
          {spam.map((flag, i) => (
            <FlagDetailsEntry
              onClick={() =>
                flag.flagger ? onUsernameClick(flag.flagger.id) : null
              }
              key={i}
              user={flag.flagger ? flag.flagger.username : <NotAvailable />}
              details={flag.additionalDetails}
            />
          ))}
        </FlagDetailsCategory>
      )}
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
