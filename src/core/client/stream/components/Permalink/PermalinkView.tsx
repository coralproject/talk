import qs from "query-string";
import * as React from "react";
import { StatelessComponent } from "react";

import Logo from "talk-stream/components/Logo";
import { Button, Flex, Typography } from "talk-ui/components";
import CommentContainer from "../../containers/CommentContainer";
import * as styles from "./PermalinkView.css";

export interface InnerProps {
  comment: {} | null;
}

const PermalinkView: StatelessComponent<InnerProps> = props => {
  let assetURL: string = "";
  const query = qs.parse(location.search);

  if (!query.assetID && !query.commentID) {
    return <div>Bad url: `assetID` and `commentID` params are needed</div>;
  }

  // TODO: (bc) temporary needed to pass the assetID to go back to the correct asset until the backend
  // returns the correct asset url
  if (query.assetID) {
    assetURL = `${location.origin}/?assetID=${query.assetID}`;
  }

  if (props.comment) {
    return (
      <div className={styles.root}>
        <Logo />
        {assetURL && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              window.location.href = assetURL;
            }}
            fullWidth
          >
            Show all Comments
          </Button>
        )}
        <Flex direction="column" className={styles.comment}>
          <CommentContainer data={props.comment} />
        </Flex>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Logo />
      <Typography className={styles.commentNotFound}>
        Comment not found
      </Typography>
      {assetURL && (
        <Button
          variant="filled"
          color="primary"
          onClick={() => {
            window.location.href = assetURL;
          }}
        >
          Back to the Stream
        </Button>
      )}
    </div>
  );
};

export default PermalinkView;
