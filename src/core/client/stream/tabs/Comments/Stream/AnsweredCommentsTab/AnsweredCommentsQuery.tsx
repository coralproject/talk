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

import { AnsweredCommentsQuery as QueryTypes } from "coral-stream/__generated__/AnsweredCommentsQuery.graphql";
import { AnsweredCommentsQueryLocal } from "coral-stream/__generated__/AnsweredCommentsQueryLocal.graphql";

import AnsweredCommentsContainer from "./AnsweredCommentsContainer";

export const render = (data: QueryRenderData<QueryTypes>) => {
  if (!data) {
    return;
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
      <AnsweredCommentsContainer
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

const AnsweredCommentsQuery: FunctionComponent = () => {
  const [{ storyID, storyURL, commentsOrderBy }] =
    useLocal<AnsweredCommentsQueryLocal>(graphql`
      fragment AnsweredCommentsQueryLocal on Local {
        storyID
        storyURL
        commentsOrderBy
      }
    `);
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query AnsweredCommentsQuery(
          $storyID: ID
          $storyURL: String
          $commentsOrderBy: COMMENT_SORT
        ) {
          viewer {
            ...AnsweredCommentsContainer_viewer
          }
          story: stream(id: $storyID, url: $storyURL) {
            ...AnsweredCommentsContainer_story
              @arguments(orderBy: $commentsOrderBy)
          }
          settings {
            ...AnsweredCommentsContainer_settings
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

export default AnsweredCommentsQuery;
