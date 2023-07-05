import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import NotAvailable from "coral-admin/components/NotAvailable";
import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { BaseButton, Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { ReactionDetailsContainer_comment } from "coral-admin/__generated__/ReactionDetailsContainer_comment.graphql";
import { ReactionDetailsContainerPaginationQuery } from "coral-admin/__generated__/ReactionDetailsContainerPaginationQuery.graphql";

import styles from "./ReactionDetailsContainer.css";

interface Props {
  comment: ReactionDetailsContainer_comment;
  relay: RelayPaginationProp;
  onUsernameClick: (id?: string) => void;
}

const ReactionDetailsContainer: FunctionComponent<Props> = ({
  comment,
  relay,
  onUsernameClick,
}) => {
  const reactions = comment.reactions
    ? comment.reactions.edges.map((edge) => edge.node)
    : [];
  const hasMore = relay.hasMore();
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  return (
    <div className={styles.container}>
      {reactions.map(
        (reaction) =>
          reaction.id && (
            <Flex key={reaction.id}>
              <BaseButton
                onClick={() => {
                  if (reaction.reacter?.userID) {
                    onUsernameClick(reaction.reacter?.userID);
                  }
                }}
                className={styles.button}
              >
                <span className={styles.username}>
                  {reaction.reacter?.username ? (
                    reaction.reacter.username
                  ) : (
                    <NotAvailable />
                  )}
                </span>
              </BaseButton>
            </Flex>
          )
      )}
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
    </div>
  );
};

type FragmentVariables = ReactionDetailsContainerPaginationQuery;

const enhanced = withPaginationContainer<
  Props,
  ReactionDetailsContainerPaginationQuery,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment ReactionDetailsContainer_comment on Comment
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
      ) {
        id
        reactions(first: $count, after: $cursor)
          @connection(key: "ReactionDetails_reactions") {
          edges {
            node {
              id
              reacter {
                userID
                username
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.comment && props.comment.reactions;
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
      query ReactionDetailsContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          ...ReactionDetailsContainer_comment
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(ReactionDetailsContainer);

export default enhanced;
