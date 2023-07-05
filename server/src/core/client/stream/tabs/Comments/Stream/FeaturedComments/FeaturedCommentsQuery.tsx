import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  QueryRenderData,
  QueryRenderer,
  useLocal,
} from "coral-framework/lib/relay";
import { Delay, Flex, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { FeaturedCommentsQuery as QueryTypes } from "coral-stream/__generated__/FeaturedCommentsQuery.graphql";
import { FeaturedCommentsQueryLocal } from "coral-stream/__generated__/FeaturedCommentsQueryLocal.graphql";

import FeaturedCommentsContainer from "./FeaturedCommentsContainer";

export const render = (data: QueryRenderData<QueryTypes>) => {
  if (!data) {
    return null;
  }
  if (data.error) {
    return <QueryError error={data.error} />;
  }

  if (!data.props) {
    return (
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    );
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
      <FeaturedCommentsContainer
        settings={data.props.settings}
        viewer={data.props.viewer}
        story={data.props.story}
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

const FeaturedCommentsQuery: FunctionComponent = () => {
  const [{ storyID, storyURL, commentsOrderBy }] =
    useLocal<FeaturedCommentsQueryLocal>(graphql`
      fragment FeaturedCommentsQueryLocal on Local {
        storyID
        storyURL
        commentsOrderBy
      }
    `);
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query FeaturedCommentsQuery(
          $storyID: ID
          $storyURL: String
          $commentsOrderBy: COMMENT_SORT
        ) {
          viewer {
            ...FeaturedCommentsContainer_viewer
          }
          story: stream(id: $storyID, url: $storyURL) {
            ...FeaturedCommentsContainer_story
              @arguments(orderBy: $commentsOrderBy)
          }
          settings {
            ...FeaturedCommentsContainer_settings
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
        commentsOrderBy,
      }}
      render={(data) => render(data)}
    />
  );
};

export default FeaturedCommentsQuery;
