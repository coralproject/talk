import { Localized } from "fluent-react/compat";
import React from "react";
import { graphql } from "react-relay";

import { FlagDetailsContainer_comment as CommentData } from "coral-admin/__generated__/FlagDetailsContainer_comment.graphql";
import NotAvailable from "coral-admin/components/NotAvailable";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLCOMMENT_FLAG_REASON } from "coral-framework/schema";
import { HorizontalGutter } from "coral-ui/components";

import FlagDetailsCategory from "./FlagDetailsCategory";
import FlagDetailsEntry from "./FlagDetailsEntry";

interface Props {
  comment: CommentData;
}

export class FlagDetailsContainer extends React.Component<Props> {
  public render() {
    const nodes = this.props.comment.flags.nodes;
    const offensiveList: React.ReactElement[] = [];
    const spamList: React.ReactElement[] = [];
    nodes.forEach((n, i) => {
      switch (n.reason) {
        case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE:
          offensiveList.push(
            <FlagDetailsEntry
              key={i}
              user={n.flagger ? n.flagger.username : <NotAvailable />}
              details={n.additionalDetails}
            />
          );
          return;
        case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM:
          spamList.push(
            <FlagDetailsEntry
              key={i}
              user={n.flagger ? n.flagger.username : <NotAvailable />}
              details={n.additionalDetails}
            />
          );
          return;
        default:
          return;
      }
    });
    if (offensiveList.length + spamList.length === 0) {
      return null;
    }
    return (
      <HorizontalGutter size="oneAndAHalf">
        {offensiveList.length > 0 && (
          <FlagDetailsCategory
            category={
              <Localized id="moderate-flagDetails-offensive">
                <span>Offensive</span>
              </Localized>
            }
          >
            {offensiveList}
          </FlagDetailsCategory>
        )}
        {spamList.length > 0 && (
          <FlagDetailsCategory
            category={
              <Localized id="moderate-flagDetails-spam">
                <span>Spam</span>
              </Localized>
            }
          >
            {spamList}
          </FlagDetailsCategory>
        )}
      </HorizontalGutter>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment FlagDetailsContainer_comment on Comment {
      flags {
        nodes {
          flagger {
            username
          }
          reason
          additionalDetails
        }
      }
    }
  `,
})(FlagDetailsContainer);

export default enhanced;
