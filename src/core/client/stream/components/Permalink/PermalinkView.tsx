import qs from "query-string";
import * as React from "react";
import { StatelessComponent } from "react";

import Logo from "talk-stream/components/Logo";
import { Button, Flex } from "talk-ui/components";
import CommentContainer from "../../containers/CommentContainer";
import * as styles from "./PermalinkView.css";

export interface InnerProps {
  comment: {} | null;
}

const PermalinkView: StatelessComponent<InnerProps> = props => {
  const query = qs.parse(location.search);

  if (!query.assetID && !query.commentID) {
    return <div>Bad url: `assetID` and `commentID` params are needed</div>;
  }

  if (props.comment) {
    // TODO (bc) temporary needed to pass the assetID to go back to the correct asset until the backend
    // returns the correct asset url
    const assetURL = `${location.origin}/?assetID=${query.assetID}`;

    return (
      <div className={styles.root}>
        <Logo />
        <Flex direction="column" className={styles.comment}>
          <CommentContainer data={props.comment} />
          <Button
            variant="filled"
            color="primary"
            onClick={() => {
              window.location.href = assetURL;
            }}
          >
            Back to the Stream
          </Button>
        </Flex>
      </div>
    );
  }

  return <div>Comment not found</div>;
};

export default PermalinkView;
