import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { coerceStoryMode } from "coral-framework/helpers";
import {
  QueryRenderData,
  QueryRenderer,
  useLocal,
} from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";
import { Flex, Spinner } from "coral-ui/components/v2";

import { AllCommentsTabQuery as QueryTypes } from "coral-stream/__generated__/AllCommentsTabQuery.graphql";
import { AllCommentsTabQueryLocal as Local } from "coral-stream/__generated__/AllCommentsTabQueryLocal.graphql";

import AllCommentsTabContainer from "./AllCommentsTabContainer";
import SpinnerWhileRendering from "./SpinnerWhileRendering";

interface Props {
  preload?: boolean;
  tag?: GQLTAG;
}

export const render = (data: QueryRenderData<QueryTypes>, tag?: GQLTAG) => {
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
          tag={tag}
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

const AllCommentsTabQuery: FunctionComponent<Props> = ({
  preload = false,
  tag,
}) => {
  const [{ storyID, storyURL, storyMode, commentsOrderBy }] = useLocal<
    Local
  >(graphql`
    fragment AllCommentsTabQueryLocal on Local {
      storyID
      storyURL
      storyMode
      commentsOrderBy
    }
  `);
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query AllCommentsTabQuery(
          $storyID: ID
          $storyURL: String
          $commentsOrderBy: COMMENT_SORT
          $tag: TAG
          $storyMode: STORY_MODE
        ) {
          viewer {
            ...AllCommentsTabContainer_viewer
          }
          story: stream(id: $storyID, url: $storyURL, mode: $storyMode) {
            ...AllCommentsTabContainer_story
              @arguments(orderBy: $commentsOrderBy, tag: $tag)
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
        tag,
        storyMode: coerceStoryMode(storyMode),
      }}
      render={(data) => (preload ? null : render(data, tag))}
    />
  );
};

export default AllCommentsTabQuery;
