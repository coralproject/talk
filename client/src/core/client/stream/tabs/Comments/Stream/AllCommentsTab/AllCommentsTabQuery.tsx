import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { coerceStoryMode } from "coral-framework/helpers";
import { useEffectAtUnmount } from "coral-framework/hooks";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  QueryRenderData,
  QueryRenderer,
  useLocal,
} from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";
import { Flex, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { AllCommentsTabQuery as QueryTypes } from "coral-stream/__generated__/AllCommentsTabQuery.graphql";
import { AllCommentsTabQueryLocal as Local } from "coral-stream/__generated__/AllCommentsTabQueryLocal.graphql";

import { useStaticFlattenReplies } from "../../helpers";
import AllCommentsTabContainer from "./AllCommentsTabContainer";
import SpinnerWhileRendering from "./SpinnerWhileRendering";

interface Props {
  tag?: GQLTAG;
  currentScrollRef: any;
}

export const render = (
  data: QueryRenderData<QueryTypes>,
  flattenReplies: boolean,
  currentScrollRef: any,
  refreshStream: boolean | null,
  tag?: GQLTAG
) => {
  if (!data) {
    return null;
  }
  if (data.error) {
    return <QueryError error={data.error} />;
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
        <IntersectionProvider threshold={[0, 1]}>
          <AllCommentsTabContainer
            settings={data.props.settings}
            viewer={data.props.viewer}
            story={data.props.story}
            tag={tag}
            flattenReplies={flattenReplies}
            currentScrollRef={currentScrollRef}
            refreshStream={refreshStream}
          />
        </IntersectionProvider>
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
  tag,
  currentScrollRef,
}) => {
  const [
    {
      storyID,
      storyURL,
      storyMode,
      ratingFilter,
      commentsOrderBy,
      refreshStream,
    },
    setLocal,
  ] = useLocal<Local>(graphql`
    fragment AllCommentsTabQueryLocal on Local {
      storyID
      storyURL
      storyMode
      ratingFilter
      commentsOrderBy
      refreshStream
    }
  `);
  const flattenReplies = useStaticFlattenReplies();

  // When we swtich off of the AllCommentsTab, reset the rating filter.
  useEffectAtUnmount(() => {
    setLocal({ ratingFilter: null });
  });

  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query AllCommentsTabQuery(
          $storyID: ID
          $storyURL: String
          $commentsOrderBy: COMMENT_SORT
          $tag: TAG
          $storyMode: STORY_MODE
          $flattenReplies: Boolean!
          $ratingFilter: Int
          $refreshStream: Boolean
        ) {
          viewer {
            ...AllCommentsTabContainer_viewer
          }
          story: stream(id: $storyID, url: $storyURL, mode: $storyMode) {
            ...AllCommentsTabContainer_story
              @arguments(
                orderBy: $commentsOrderBy
                tag: $tag
                ratingFilter: $ratingFilter
                refreshStream: $refreshStream
              )
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
        ratingFilter,
        storyMode: coerceStoryMode(storyMode),
        flattenReplies,
        refreshStream,
      }}
      render={(data) =>
        render(data, flattenReplies, currentScrollRef, refreshStream, tag)
      }
    />
  );
};

export default AllCommentsTabQuery;
