import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { ReadyState } from "react-relay";
import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { StreamQuery as QueryTypes } from "talk-stream/__generated__/StreamQuery.graphql";
import { StreamQueryLocal as Local } from "talk-stream/__generated__/StreamQueryLocal.graphql";
import { Delay, Spinner } from "talk-ui/components";
import StreamContainer from "../containers/StreamContainer";

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
        <Localized id="comments-streamQuery-storyNotFound">
          <div>Story not found</div>
        </Localized>
      );
    }
    return (
      <StreamContainer
        settings={props.settings}
        me={props.me}
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

const StreamQuery: StatelessComponent<InnerProps> = ({
  local: { storyID, storyURL },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query StreamQuery($storyID: ID, $storyURL: String) {
        me {
          ...StreamContainer_me
        }
        story(id: $storyID, url: $storyURL) {
          ...StreamContainer_story
        }
        settings {
          ...StreamContainer_settings
        }
      }
    `}
    variables={{
      storyID,
      storyURL,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer(
  graphql`
    fragment StreamQueryLocal on Local {
      storyID
      storyURL
    }
  `
)(StreamQuery);

export default enhanced;
