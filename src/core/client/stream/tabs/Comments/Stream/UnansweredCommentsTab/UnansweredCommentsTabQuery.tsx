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

import { UnansweredCommentsTabQuery as QueryTypes } from "coral-stream/__generated__/UnansweredCommentsTabQuery.graphql";
import { UnansweredCommentsTabQueryLocal as Local } from "coral-stream/__generated__/UnansweredCommentsTabQueryLocal.graphql";

import SpinnerWhileRendering from "../AllCommentsTab/SpinnerWhileRendering";
import UnansweredCommentsTabContainer from "./UnansweredCommentsTabContainer";

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
        <UnansweredCommentsTabContainer
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

const UnansweredCommentsTabQuery: FunctionComponent<Props> = (props) => {
  const {
    local: { storyID, storyURL, commentsOrderBy, featureFlags },
  } = props;

  const flattenLastReply =
    featureFlags && !!featureFlags.includes(GQLFEATURE_FLAG.FLATTEN_REPLIES);

  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UnansweredCommentsTabQuery(
          $storyID: ID
          $storyURL: String
          $commentsOrderBy: COMMENT_SORT
          $flattenLastReply: Boolean!
        ) {
          viewer {
            ...UnansweredCommentsTabContainer_viewer
          }
          story: stream(id: $storyID, url: $storyURL) {
            ...UnansweredCommentsTabContainer_story
              @arguments(orderBy: $commentsOrderBy, tag: UNANSWERED)
          }
          settings {
            ...UnansweredCommentsTabContainer_settings
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
    fragment UnansweredCommentsTabQueryLocal on Local {
      storyID
      storyURL
      commentsOrderBy
      featureFlags
    }
  `
)(UnansweredCommentsTabQuery);

export default enhanced;
