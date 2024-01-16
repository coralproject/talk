import { FluentBundle } from "@fluent/bundle/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { Delay, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { AdditionalCommentQuery as QueryTypes } from "coral-stream/__generated__/AdditionalCommentQuery.graphql";

export const render = (
  { error, props }: QueryRenderData<QueryTypes>,
  additionalComment: { id: string; url: string },
  onAddCommentError: (errorMessage: string, commentID: string) => void,
  onAddCommentSuccess: (id: string, url: string) => void,
  localeBundles: FluentBundle[]
) => {
  if (error) {
    return <QueryError error={error} />;
  }
  if (props) {
    if (!props.comment) {
      const commentNotFoundError = getMessage(
        localeBundles,
        "comments-permalinkView-reportIllegalContent-additionalComments-commentNotFoundError",
        "Comment not found. Please enter a valid comment URL"
      );
      onAddCommentError(commentNotFoundError, additionalComment.id);
      return null;
    }
    if (props.comment.viewerActionPresence?.illegal) {
      const previouslyReportedError = getMessage(
        localeBundles,
        "comments-permalinkView-reportIllegalContent-additionalComments-previouslyReportedCommentError",
        "You've previously reported this comment for containing illegal content. You may only report a comment for this reason one time."
      );
      onAddCommentError(previouslyReportedError, additionalComment.id);
      return null;
    }
    onAddCommentSuccess(additionalComment.id, additionalComment.url);
    return null;
  }
  return (
    <Delay>
      <Spinner />
    </Delay>
  );
};

interface Props {
  additionalComment: { id: string; url: string };
  onAddCommentError: (errorMessage: string, commentID: string) => void;
  onAddCommentSuccess: (id: string, url: string) => void;
}

const AdditionalCommentQuery: FunctionComponent<Props> = ({
  additionalComment,
  onAddCommentError,
  onAddCommentSuccess,
}) => {
  const { localeBundles } = useCoralContext();
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query AdditionalCommentQuery($commentID: ID!) {
          comment(id: $commentID) {
            id
            viewerActionPresence {
              illegal
            }
          }
        }
      `}
      variables={{
        commentID: additionalComment.id,
      }}
      render={(data) => {
        return render(
          data,
          additionalComment,
          onAddCommentError,
          onAddCommentSuccess,
          localeBundles
        );
      }}
    />
  );
};

export default AdditionalCommentQuery;
