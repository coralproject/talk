import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { PermalinkViewQuery as QueryTypes } from "coral-stream/__generated__/PermalinkViewQuery.graphql";
import { PermalinkViewQueryLocal as Local } from "coral-stream/__generated__/PermalinkViewQueryLocal.graphql";
import Spinner from "coral-stream/common/Spinner";
import { Delay } from "coral-ui/components";

import PermalinkViewContainer from "./PermalinkViewContainer";

interface Props {
  local: Local;
}

export const render = ({
  error,
  props,
}: ReadyState<QueryTypes["response"]>) => {
  if (error) {
    return <div>{error.message}</div>;
  }
  if (props) {
    if (!props.story) {
      return (
        <Localized id="comments-permalinkViewQuery-storyNotFound">
          <div>Story not found</div>
        </Localized>
      );
    }
    return (
      <PermalinkViewContainer
        viewer={props.viewer}
        settings={props.settings}
        comment={props.comment}
        story={props.story}
      />
    );
  }
  return (
    <Delay>
      <Spinner />
    </Delay>
  );
};

const PermalinkViewQuery: FunctionComponent<Props> = ({
  local: { commentID, storyID, storyURL },
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query PermalinkViewQuery(
          $commentID: ID!
          $storyID: ID
          $storyURL: String
        ) {
          viewer {
            ...PermalinkViewContainer_viewer
          }
          story(id: $storyID, url: $storyURL) {
            ...PermalinkViewContainer_story
          }
          comment(id: $commentID) {
            ...PermalinkViewContainer_comment
          }
          settings {
            ...PermalinkViewContainer_settings
          }
        }
      `}
      variables={{
        commentID: commentID!,
        storyID,
        storyURL,
      }}
      render={render}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment PermalinkViewQueryLocal on Local {
      storyID
      commentID
      storyURL
    }
  `
)(PermalinkViewQuery);

export default enhanced;
