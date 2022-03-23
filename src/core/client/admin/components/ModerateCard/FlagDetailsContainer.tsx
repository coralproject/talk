import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_FLAG_REASON } from "coral-framework/schema";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import {
  COMMENT_FLAG_REASON,
  FlagDetailsContainer_comment,
} from "coral-admin/__generated__/FlagDetailsContainer_comment.graphql";
import { FlagDetailsContainerPaginationQuery } from "coral-admin/__generated__/FlagDetailsContainerPaginationQuery.graphql";

import FlagDetails from "./FlagDetails";

import styles from "./FlagDetailsContainer.css";

interface Reasons<T> {
  offensive: T[];
  abusive: T[];
  spam: T[];
  other: T[];
}

function reduceReasons(flags: FlagDetailsContainer_comment["flags"]["edges"]) {
  const initialValue: Reasons<{
    readonly flagger: {
      readonly username: string | null;
      readonly id: string;
    } | null;
    readonly reason: COMMENT_FLAG_REASON | null;
    readonly additionalDetails: string | null;
  }> = {
    offensive: [],
    abusive: [],
    spam: [],
    other: [],
  };

  return flags.reduce((reasons, flag) => {
    switch (flag.node.reason) {
      case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE:
        reasons.offensive.push(flag.node);
        break;
      case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_ABUSIVE:
        reasons.abusive.push(flag.node);
        break;
      case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM:
        reasons.spam.push(flag.node);
        break;
      case GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OTHER:
        reasons.other.push(flag.node);
        break;
    }

    return reasons;
  }, initialValue);
}

interface Props {
  comment: FlagDetailsContainer_comment;
  onUsernameClick: (id?: string) => void;
  relay: RelayPaginationProp;
}

const FlagDetailsContainer: FunctionComponent<Props> = ({
  comment,
  onUsernameClick,
  relay,
}) => {
  const { offensive, abusive, spam, other } = useMemo(
    () => reduceReasons(comment.flags.edges),
    [comment.flags.edges]
  );
  const hasMore = relay.hasMore();
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  return (
    <div className={styles.container}>
      <HorizontalGutter size="oneAndAHalf">
        <Flex direction="row" spacing={3}>
          <Flex direction="column">
            <FlagDetails
              category={
                <Localized id="moderate-flagDetails-offensive">
                  <span>Offensive</span>
                </Localized>
              }
              nodes={offensive}
              onUsernameClick={onUsernameClick}
            />
          </Flex>
          <Flex direction="column">
            <FlagDetails
              category={
                <Localized id="moderate-flagDetails-abusive">
                  <span>Abusive</span>
                </Localized>
              }
              nodes={abusive}
              onUsernameClick={onUsernameClick}
            />
          </Flex>
          <Flex direction="column">
            <FlagDetails
              category={
                <Localized id="moderate-flagDetails-spam">
                  <span>Spam</span>
                </Localized>
              }
              nodes={spam}
              onUsernameClick={onUsernameClick}
            />
          </Flex>
          <Flex direction="column">
            <FlagDetails
              category={
                <Localized id="moderate-flagDetails-other">
                  <span>Other</span>
                </Localized>
              }
              nodes={other}
              onUsernameClick={onUsernameClick}
            />
          </Flex>
        </Flex>
        {hasMore && (
          <Localized id="moderateCardDetails-tab-reactions-loadMore">
            <Button
              variant="outlined"
              color="secondary"
              fontSize="extraSmall"
              onClick={loadMore}
              disabled={isLoadingMore}
            >
              Load More
            </Button>
          </Localized>
        )}
      </HorizontalGutter>
    </div>
  );
};

type FragmentVariables = FlagDetailsContainerPaginationQuery;

const enhanced = withPaginationContainer<
  Props,
  FlagDetailsContainerPaginationQuery,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment FlagDetailsContainer_comment on Comment
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "Cursor" }
        ) {
        revision {
          metadata {
            perspective {
              score
            }
          }
        }
        id
        flags(first: $count, after: $cursor)
          @connection(key: "FlagDetails_flags") {
          edges {
            node {
              flagger {
                username
                id
              }
              reason
              additionalDetails
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.comment && props.comment.flags;
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
        commentID: props.comment.id,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query FlagDetailsContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          ...FlagDetailsContainer_comment
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(FlagDetailsContainer);

export default enhanced;
