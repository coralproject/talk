import * as React from "react";
import { StatelessComponent } from "react";

import { CommentProps } from "talk-stream/components/Comment";
import { Flex } from "talk-ui/components";
import CommentContainer from "../containers/CommentContainer";

export interface AppProps {
  comment: CommentProps | null;
}

const PermalinkView: StatelessComponent<AppProps> = props => {
  if (props.comment) {
    return (
      <Flex justifyContent="center">
        <Flex direction="column" itemGutter>
          <CommentContainer data={props.comment} />
        </Flex>
      </Flex>
    );
  }

  return <div> Error </div>;
};

export default PermalinkView;
