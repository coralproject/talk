import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { StreamQuery as QueryTypes } from "coral-stream/__generated__/StreamQuery.graphql";
import { StreamQueryLocal as Local } from "coral-stream/__generated__/StreamQueryLocal.graphql";
import { Delay, Flex, Spinner } from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import StreamContainer from "./StreamContainer";

interface Props {
  local: Local;
}

export const render = (
  data: ReadyState<QueryTypes["response"]>,
  defaultStreamOrderBy: Props["local"]["defaultStreamOrderBy"]
) => {
  if (data.error) {
    return <div>{data.error.message}</div>;
  }

  if (data.props) {
    if (!data.props.story) {
      return (
        <Localized id="comments-streamQuery-storyNotFound">
          <div>Story not found</div>
        </Localized>
      );
    }
    return (
      <StreamContainer
        settings={data.props.settings}
        viewer={data.props.viewer}
        story={data.props.story}
        defaultOrderBy={defaultStreamOrderBy}
      />
    );
  }

  return (
    <Delay>
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    </Delay>
  );
};

const StreamQuery: FunctionComponent<Props> = props => {
  const {
    local: { storyID, storyURL, defaultStreamOrderBy },
  } = props;
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query StreamQuery(
          $storyID: ID
          $storyURL: String
          $streamOrderBy: COMMENT_SORT
        ) {
          viewer {
            ...StreamContainer_viewer
          }
          story(id: $storyID, url: $storyURL) {
            ...StreamContainer_story @arguments(orderBy: $streamOrderBy)
          }
          settings {
            ...StreamContainer_settings
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
        streamOrderBy: defaultStreamOrderBy,
      }}
      render={data => render(data, props.local.defaultStreamOrderBy)}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment StreamQueryLocal on Local {
      storyID
      storyURL
      defaultStreamOrderBy
    }
  `
)(StreamQuery);

export default enhanced;
