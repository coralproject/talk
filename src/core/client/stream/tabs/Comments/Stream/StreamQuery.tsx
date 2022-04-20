import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { coerceStoryMode } from "coral-framework/helpers";
import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import useHandleIncompleteAccount from "coral-stream/common/useHandleIncompleteAccount";
import { useStreamLocal } from "coral-stream/local/StreamLocal";
import { Delay, Flex, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { StreamQuery as QueryTypes } from "coral-stream/__generated__/StreamQuery.graphql";

import StreamContainer from "./StreamContainer";

export const render = (data: QueryRenderData<QueryTypes>) => {
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
      <Delay>
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      </Delay>
    </>
  );
};

const StreamQuery: FunctionComponent = () => {
  const { storyID, storyURL, storyMode } = useStreamLocal();

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
          return render(data);
        }}
      />
    </>
  );
};

export default StreamQuery;
