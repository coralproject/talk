import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import {
  graphql,
  QueryRenderData,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import Spinner from "coral-stream/common/Spinner";
import useHandleIncompleteAccount from "coral-stream/common/useHandleIncompleteAccount";
import { Delay, Flex } from "coral-ui/components";

import { COMMENTS_TAB } from "coral-stream/__generated__/StreamContainerLocal.graphql";
import { StreamQuery as QueryTypes } from "coral-stream/__generated__/StreamQuery.graphql";
import { StreamQueryLocal as Local } from "coral-stream/__generated__/StreamQueryLocal.graphql";

import { AllCommentsTabQuery } from "./AllCommentsTab";
import StreamContainer from "./StreamContainer";

interface Props {
  local: Local;
}

export const render = (
  data: QueryRenderData<QueryTypes>,
  commentsTab: COMMENTS_TAB
) => {
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

const StreamQuery: FunctionComponent<Props> = props => {
  const {
    local: { storyID, storyURL, commentsTab },
  } = props;
  const handleIncompleteAccount = useHandleIncompleteAccount();
  return (
    <>
      <QueryRenderer<QueryTypes>
        query={graphql`
          query StreamQuery($storyID: ID, $storyURL: String) {
            viewer {
              ...StreamContainer_viewer
            }
            story: stream(id: $storyID, url: $storyURL) {
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
        }}
        render={data => {
          if (handleIncompleteAccount(data)) {
            return null;
          }
          return render(data, commentsTab);
        }}
      />
    </>
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment StreamQueryLocal on Local {
      storyID
      storyURL
      commentsOrderBy
      commentsTab
    }
  `
)(StreamQuery);

export default enhanced;
