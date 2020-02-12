import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import {
  graphql,
  QueryRenderData,
  QueryRenderer,
} from "coral-framework/lib/relay";
import { CallOut, Card, Spinner } from "coral-ui/components/v2";

import { ConversationModalQuery as QueryTypes } from "coral-admin/__generated__/ConversationModalQuery.graphql";

import ConversationModalContainer from "./ConversationModalContainer";
import ConversationModalHeaderContainer from "./ConversationModalHeaderContainer";
import ConversationModalRepliesContainer from "./ConversationModalRepliesContainer";

import styles from "./ConversationModalQuery.css";

interface Props {
  commentID: string;
  onClose: () => void;
  firstFocusableRef: React.RefObject<any>;
  lastFocusableRef: React.RefObject<any>;
}

const ConversationModalQuery: FunctionComponent<Props> = ({
  commentID,
  onClose,
  lastFocusableRef,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query ConversationModalQuery($commentID: ID!) {
          comment(id: $commentID) {
            ...ConversationModalContainer_comment
            ...ConversationModalRepliesContainer_comment
            ...ConversationModalHeaderContainer_comment
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
          <Card className={styles.root}>
            <ConversationModalHeaderContainer
              onClose={onClose}
              comment={props.comment}
              focusableRef={lastFocusableRef}
            />
            <div className={styles.body}>
              <ConversationModalContainer
                onClose={onClose}
                comment={props.comment}
              />
              <ConversationModalRepliesContainer
                onClose={onClose}
                comment={props.comment}
              />
            </div>
          </Card>
        );
      }}
    />
  );
};

export default ConversationModalQuery;
