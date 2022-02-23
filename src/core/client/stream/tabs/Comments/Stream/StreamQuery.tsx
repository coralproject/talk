import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { coerceStoryMode } from "coral-framework/helpers";
import {
  QueryRenderData,
  QueryRenderer,
  useLocal,
} from "coral-framework/lib/relay";
import useHandleIncompleteAccount from "coral-stream/common/useHandleIncompleteAccount";
import { Delay, Flex, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { COMMENTS_TAB } from "coral-stream/__generated__/StreamContainerLocal.graphql";
import { StreamQuery as QueryTypes } from "coral-stream/__generated__/StreamQuery.graphql";
import { StreamQueryLocal$data as Local } from "coral-stream/__generated__/StreamQueryLocal.graphql";

import { AllCommentsTabQuery } from "./AllCommentsTab";
import StreamContainer from "./StreamContainer";

export const render = (
  data: QueryRenderData<QueryTypes>,
  commentsTab: COMMENTS_TAB
) => {
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
      <StreamContainer
        settings={data.props.settings}
        viewer={data.props.viewer}
        story={data.props.story}
      />
    );
  }

  return (
    <>
      {// TODO: (cvle) For some reason this way of preloading
      // causes weird errors in the
      // tests. Needs further investigation.
      process.env.NODE_ENV !== "test" && commentsTab === "ALL_COMMENTS" && (
        <AllCommentsTabQuery preload />
      )}
      <Delay>
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      </Delay>
    </>
  );
};

const StreamQuery: FunctionComponent = () => {
  const [{ storyID, storyURL, storyMode, commentsTab }] = useLocal<
    Local
  >(graphql`
    fragment StreamQueryLocal on Local {
      storyID
      storyURL
      storyMode
      commentsOrderBy
      commentsTab
    }
  `);

  const handleIncompleteAccount = useHandleIncompleteAccount();
  return (
    <>
      <QueryRenderer<QueryTypes>
        query={graphql`
          query StreamQuery(
            $storyID: ID
            $storyURL: String
            $storyMode: STORY_MODE
          ) {
            viewer {
              ...StreamContainer_viewer
            }
            story: stream(id: $storyID, url: $storyURL, mode: $storyMode) {
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
          storyMode: coerceStoryMode(storyMode),
        }}
        render={(data) => {
          if (handleIncompleteAccount(data)) {
            return null;
          }
          return render(data, commentsTab);
        }}
      />
    </>
  );
};

export default StreamQuery;
