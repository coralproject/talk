import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  QueryRenderData,
  QueryRenderer,
  useLocal,
} from "coral-framework/lib/relay";
import useHandleIncompleteAccount from "coral-stream/common/useHandleIncompleteAccount";
import { Delay, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { IllegalContentReportViewQuery as QueryTypes } from "coral-stream/__generated__/IllegalContentReportViewQuery.graphql";
import { IllegalContentReportViewQueryLocal } from "coral-stream/__generated__/IllegalContentReportViewQueryLocal.graphql";

import IllegalContentReportViewContainer from "./IllegalContentReportViewContainer";

export const render = (
  { error, props }: QueryRenderData<QueryTypes>,
  refreshStream: boolean | null
) => {
  if (error) {
    return <QueryError error={error} />;
  }
  if (props) {
    if (!props.story) {
      return (
        <Localized id="comments-permalinkViewQuery-storyNotFound">
          <div>Story not found</div>
        </Localized>
      );
    }
    return (
      <IllegalContentReportViewContainer
        viewer={props.viewer}
        settings={props.settings}
        comment={props.comment}
        story={props.story}
        refreshStream={refreshStream}
      />
    );
  }
  return (
    <Delay>
      <Spinner />
    </Delay>
  );
};

const IllegalContentReportViewQuery: FunctionComponent = () => {
  const handleIncompleteAccount = useHandleIncompleteAccount();
  const [{ storyID, storyURL, commentID, refreshStream }] =
    useLocal<IllegalContentReportViewQueryLocal>(graphql`
      fragment IllegalContentReportViewQueryLocal on Local {
        storyID
        storyURL
        commentID
        refreshStream
      }
    `);
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query IllegalContentReportViewQuery(
          $commentID: ID!
          $storyID: ID
          $storyURL: String
        ) {
          viewer {
            ...IllegalContentReportViewContainer_viewer
          }
          story(id: $storyID, url: $storyURL) {
            ...IllegalContentReportViewContainer_story
          }
          comment(id: $commentID) {
            ...IllegalContentReportViewContainer_comment
          }
          settings {
            ...IllegalContentReportViewContainer_settings
          }
        }
      `}
      variables={{
        commentID,
        storyID,
        storyURL,
      }}
      render={(data) => {
        if (handleIncompleteAccount(data)) {
          return null;
        }
        return render(data, refreshStream);
      }}
    />
  );
};

export default IllegalContentReportViewQuery;
