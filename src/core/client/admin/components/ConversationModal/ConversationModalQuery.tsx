import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { CallOut, Card, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { ConversationModalQuery as QueryTypes } from "coral-admin/__generated__/ConversationModalQuery.graphql";

import ConversationModalContainer from "./ConversationModalContainer";
import ConversationModalHeaderContainer from "./ConversationModalHeaderContainer";
import ConversationModalRepliesContainer from "./ConversationModalRepliesContainer";

import styles from "./ConversationModalQuery.css";

interface Props {
  commentID: string;
  onClose: () => void;
  firstFocusableRef: React.RefObject<any>;
  onUsernameClicked: (userID: string) => void;
  lastFocusableRef: React.RefObject<any>;
}

const ConversationModalQuery: FunctionComponent<Props> = ({
  commentID,
  onClose,
  lastFocusableRef,
  onUsernameClicked,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query ConversationModalQuery($commentID: ID!) {
          settings {
            ...ConversationModalContainer_settings
            ...ConversationModalRepliesContainer_settings
          }
          comment(id: $commentID) {
            ...ConversationModalContainer_comment
            ...ConversationModalRepliesContainer_comment
            ...ConversationModalHeaderContainer_comment
          }
        }
      `}
      variables={{ commentID }}
      cacheConfig={{ force: true }}
      render={({ props, error }: QueryRenderData<QueryTypes>) => {
        if (error) {
          return <QueryError error={error} />;
        }

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
                <Localized id="conversation-modal-commentNotFound">
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
                settings={props.settings}
                comment={props.comment}
                onUsernameClicked={onUsernameClicked}
              />
              <ConversationModalRepliesContainer
                onClose={onClose}
                comment={props.comment}
                settings={props.settings}
                onUsernameClicked={onUsernameClicked}
              />
            </div>
          </Card>
        );
      }}
    />
  );
};

export default ConversationModalQuery;
