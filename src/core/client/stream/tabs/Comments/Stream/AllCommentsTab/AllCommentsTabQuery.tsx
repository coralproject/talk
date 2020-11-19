import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  QueryRenderData,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";
import { Flex, Spinner } from "coral-ui/components/v2";

import { AllCommentsTabQuery as QueryTypes } from "coral-stream/__generated__/AllCommentsTabQuery.graphql";
import { AllCommentsTabQueryLocal as Local } from "coral-stream/__generated__/AllCommentsTabQueryLocal.graphql";

import AllCommentsTabContainer from "./AllCommentsTabContainer";
import SpinnerWhileRendering from "./SpinnerWhileRendering";

interface Props {
  local: Local;
  preload?: boolean;
}

export const render = (data: QueryRenderData<QueryTypes>) => {
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
      <SpinnerWhileRendering>
        <AllCommentsTabContainer
          settings={data.props.settings}
          viewer={data.props.viewer}
          story={data.props.story}
        />
      </SpinnerWhileRendering>
    );
  }
  return (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  );
};

const AllCommentsTabQuery: FunctionComponent<Props> = (props) => {
  const {
    local: { storyID, storyURL, commentsOrderBy, featureFlags },
  } = props;

  const flattenLastReply =
    featureFlags && !!featureFlags.includes(GQLFEATURE_FLAG.FLATTEN_REPLIES);

  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query AllCommentsTabQuery(
          $storyID: ID
          $storyURL: String
          $commentsOrderBy: COMMENT_SORT
          $flattenLastReply: Boolean!
        ) {
          viewer {
            ...AllCommentsTabContainer_viewer
          }
          story: stream(id: $storyID, url: $storyURL) {
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
        flattenLastReply,
      }}
      render={(data) => (props.preload ? null : render(data))}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment AllCommentsTabQueryLocal on Local {
      storyID
      storyURL
      commentsOrderBy
      featureFlags
    }
  `
)(AllCommentsTabQuery);

export default enhanced;
