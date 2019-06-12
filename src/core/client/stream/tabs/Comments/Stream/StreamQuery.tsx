import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { StreamQuery as QueryTypes } from "coral-stream/__generated__/StreamQuery.graphql";
import { StreamQueryLocal as Local } from "coral-stream/__generated__/StreamQueryLocal.graphql";
import { Delay, Flex, Spinner } from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { AllCommentsTabQuery } from "./AllCommentsTab";
import StreamContainer from "./StreamContainer";

interface Props {
  local: Local;
}

export const render = (data: ReadyState<QueryTypes["response"]>) => {
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
    <Delay>
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    </Delay>
  );
};

const StreamQuery: FunctionComponent<Props> = props => {
  const {
    local: { storyID, storyURL, commentsTab },
  } = props;
  return (
    <>
      <QueryRenderer<QueryTypes>
        query={graphql`
          query StreamQuery($storyID: ID, $storyURL: String) {
            viewer {
              ...StreamContainer_viewer
            }
            story(id: $storyID, url: $storyURL) {
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
          if (
            // TODO: (cvle) For some reason this way of preloading
            // causes weird errors in the
            // tests. Needs further investigation.
            process.env.NODE_ENV !== "test" &&
            !data.props &&
            !data.error
          ) {
            return (
              <>
                {commentsTab === "ALL_COMMENTS" && (
                  <AllCommentsTabQuery preload />
                )}
              </>
            );
          }
          return render(data);
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
