// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ConversationModalContainer_comment } from "coral-admin/__generated__/ConversationModalContainer_comment.graphql";

// import styles from "./ConversationModalContainer.css";

interface Props {
  comment: ConversationModalContainer_comment;
  onClose: () => void;
}

const ConversationModalContainer: FunctionComponent<Props> = ({ comment }) => {
  return (
    <HorizontalGutter>
      <p>{comment.body}</p>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ConversationModalContainer_comment on Comment {
      id
      body
    }
  `,
})(ConversationModalContainer);

export default enhanced;
