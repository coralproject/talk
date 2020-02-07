import React, { FunctionComponent } from "react";

import CommentHistoryContainer from "./CommentHistoryContainer";
import DownloadCommentsContainer from "./DownloadCommentsContainer";

import { PropTypesOf } from "coral-framework/types";
// import {} from "coral-ui/components/v2";

// import styles from "./MyComments.css";

interface Props {
  settings: PropTypesOf<typeof CommentHistoryContainer>["settings"];
  viewer: PropTypesOf<typeof CommentHistoryContainer>["viewer"] &
    PropTypesOf<typeof DownloadCommentsContainer>["viewer"];
  story: PropTypesOf<typeof CommentHistoryContainer>["story"];
}

const MyComments: FunctionComponent<Props> = props => {
  return (
    <div>
      <CommentHistoryContainer
        settings={props.settings}
        viewer={props.viewer}
        story={props.story}
      />
      <DownloadCommentsContainer viewer={props.viewer} />
    </div>
  );
};

export default MyComments;
