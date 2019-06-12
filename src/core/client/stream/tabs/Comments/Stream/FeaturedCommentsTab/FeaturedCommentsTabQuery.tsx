import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { FeaturedCommentsTabQuery as QueryTypes } from "coral-stream/__generated__/FeaturedCommentsTabQuery.graphql";
import { FeaturedCommentsTabQueryLocal as Local } from "coral-stream/__generated__/FeaturedCommentsTabQueryLocal.graphql";
import { Delay, Flex, Spinner } from "coral-ui/components";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import FeaturedCommentsTabContainer from "./FeaturedCommentsTabContainer";

interface Props {
  local: Local;
  preload?: boolean;
}

export const render = (data: ReadyState<QueryTypes["response"]>) => {
  if (data.error) {
    return <div>{data.error.message}</div>;
  }
  if (!data.props) {
    return (
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    );
  }
  if (data.props) {
    return (
      <FeaturedCommentsTabContainer
        settings={data.props.settings}
        viewer={data.props.viewer}
        story={data.props.story!}
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

const FeaturedCommentsTabQuery: FunctionComponent<Props> = props => {
  const {
    local: { storyID, storyURL, commentsOrderBy },
  } = props;
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query FeaturedCommentsTabQuery(
          $storyID: ID
          $storyURL: String
          $commentsOrderBy: COMMENT_SORT
        ) {
          viewer {
            ...FeaturedCommentsTabContainer_viewer
          }
          story(id: $storyID, url: $storyURL) {
            ...FeaturedCommentsTabContainer_story
              @arguments(orderBy: $commentsOrderBy)
          }
          settings {
            ...FeaturedCommentsTabContainer_settings
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
        commentsOrderBy,
      }}
      render={data => (props.preload ? null : render(data))}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment FeaturedCommentsTabQueryLocal on Local {
      storyID
      storyURL
      commentsOrderBy
    }
  `
)(FeaturedCommentsTabQuery);

export default enhanced;
