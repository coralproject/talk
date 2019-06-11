import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { AllCommentsTabQuery as QueryTypes } from "coral-stream/__generated__/AllCommentsTabQuery.graphql";
import { AllCommentsTabQueryLocal as Local } from "coral-stream/__generated__/AllCommentsTabQueryLocal.graphql";
import { Delay, Flex, Spinner } from "coral-ui/components";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import AllCommentsTabContainer from "./AllCommentsTabContainer";

interface Props {
  local: Local;
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
      <AllCommentsTabContainer
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

const AllCommentsTabQuery: FunctionComponent<Props> = props => {
  const {
    local: { storyID, storyURL, commentsOrderBy },
  } = props;
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query AllCommentsTabQuery(
          $storyID: ID
          $storyURL: String
          $commentsOrderBy: COMMENT_SORT
        ) {
          viewer {
            ...AllCommentsTabContainer_viewer
          }
          story(id: $storyID, url: $storyURL) {
            ...AllCommentsTabContainer_story
              @arguments(orderBy: $commentsOrderBy)
          }
          settings {
            ...AllCommentsTabContainer_settings
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
        commentsOrderBy,
      }}
      render={data => render(data)}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment AllCommentsTabQueryLocal on Local {
      storyID
      storyURL
      commentsOrderBy
    }
  `
)(AllCommentsTabQuery);

export default enhanced;
