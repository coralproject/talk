import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import {
  graphql,
  QueryRenderData,
  QueryRenderer,
} from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components/v2";

import { ConversationModalQuery as QueryTypes } from "coral-admin/__generated__/ConversationModalQuery.graphql";

import ConversationModalContainer from "./ConversationModalContainer";

// import styles from "./ConversationModalQuery.css";

interface Props {
  commentID: string;
  onClose: () => void;
  firstFocusableRef: React.RefObject<any>;
  lastFocusableRef: React.RefObject<any>;
}

const ConversationModalQuery: FunctionComponent<Props> = ({
  commentID,
  onClose,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query ConversationModalQuery($commentID: ID!) {
          comment(id: $commentID) {
            ...ConversationModalContainer_comment
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

        return (
          <ConversationModalContainer
            onClose={onClose}
            comment={props.comment}
          />
        );
      }}
    />
  );
};

export default ConversationModalQuery;
