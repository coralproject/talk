import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { PermalinkViewQuery as QueryTypes } from "talk-stream/__generated__/PermalinkViewQuery.graphql";
import { PermalinkViewQueryLocal as Local } from "talk-stream/__generated__/PermalinkViewQueryLocal.graphql";

import { Spinner } from "talk-ui/components";
import PermalinkViewContainer from "../containers/PermalinkViewContainer";

interface InnerProps {
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
        me={props.me}
        settings={props.settings}
        comment={props.comment}
        story={props.story}
      />
    );
  }
  return <Spinner />;
};

const PermalinkViewQuery: StatelessComponent<InnerProps> = ({
  local: { commentID, storyID, storyURL },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query PermalinkViewQuery(
        $commentID: ID!
        $storyID: ID
        $storyURL: String
      ) {
        me {
          ...PermalinkViewContainer_me
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
