import React, { ComponentType, FunctionComponent } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { PermalinkButtonContainer_story as StoryData } from "coral-stream/__generated__/PermalinkButtonContainer_story.graphql";

import PermalinkButton from "./PermalinkButton";

interface Props {
  story: StoryData;
  commentID: string;
  author?: string | null;
  view?: string;
  buttonText?: string;
  buttonTextID?: string;
  ButtonIcon?: ComponentType;
}

export const PermalinkButtonContainer: FunctionComponent<Props> = ({
  story,
  commentID,
  author,
  view,
  buttonText,
  buttonTextID,
  ButtonIcon,
}) => {
  return (
    <PermalinkButton
      commentID={commentID}
      url={getURLWithCommentID(story.url, commentID, view)}
      author={author}
      buttonText={buttonText}
      buttonTextID={buttonTextID}
      ButtonIcon={ButtonIcon}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment PermalinkButtonContainer_story on Story {
      url
    }
  `,
})(PermalinkButtonContainer);

export default enhanced;
