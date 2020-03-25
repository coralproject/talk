import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import {
  graphql,
  QueryRenderData,
  QueryRenderer,
} from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components/v2";

import { ConversationModalRepliesQuery as QueryTypes } from "coral-admin/__generated__/ConversationModalRepliesQuery.graphql";
import ConversationModalCommentContainer from "./ConversationModalCommentContainer";

interface Props {
  commentID: string;
  onUsernameClicked: (userID: string) => void;
}

const ConversationModalRepliesQuery: FunctionComponent<Props> = ({
  commentID,
  onUsernameClicked,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query ConversationModalRepliesQuery($commentID: ID!) {
          comment(id: $commentID) {
            replies {
              edges {
                node {
                  id
                  ...ConversationModalCommentContainer_comment
                }
              }
            }
          }
        }
      `}
      variables={{ commentID }}
      cacheConfig={{ force: true }}
      render={({ props }: QueryRenderData<QueryTypes>) => {
        if (!props) {
          return (
            <div>
              <Spinner />
            </div>
          );
        }

        if (!props.comment) {
          return (
            <div>
              <CallOut>
                <Localized id="conversation-modal-comment-not-found">
                  Comment not found.
                </Localized>
              </CallOut>
            </div>
          );
        }

        const replies = props.comment.replies.edges.map(edge => edge.node);
        return (
          <div>
            {replies.map(reply => (
              <div key={reply.id}>
                <ConversationModalCommentContainer
                  key={reply.id}
                  comment={reply}
                  isHighlighted={false}
                  isReply={true}
                  onUsernameClick={onUsernameClicked}
                />
              </div>
            ))}
          </div>
        );
      }}
    />
  );
};

export default ConversationModalRepliesQuery;
