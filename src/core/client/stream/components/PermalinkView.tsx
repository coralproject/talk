import * as React from "react";
import { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";
import CommentContainer from "../containers/CommentContainer";

export interface InnerProps {
  comment: {} | null;
}

const PermalinkView: StatelessComponent<InnerProps> = props => {
  if (props.comment) {
    return (
      <Flex justifyContent="center">
        <Flex direction="column">
          <CommentContainer data={props.comment} />
        </Flex>
      </Flex>
    );
  }

  return <div>Comment not found</div>;
};

export default PermalinkView;
