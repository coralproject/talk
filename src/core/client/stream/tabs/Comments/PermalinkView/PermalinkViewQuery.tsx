import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  QueryRenderData,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import useHandleIncompleteAccount from "coral-stream/common/useHandleIncompleteAccount";
import { Delay, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { PermalinkViewQuery as QueryTypes } from "coral-stream/__generated__/PermalinkViewQuery.graphql";
import { PermalinkViewQueryLocal$data as Local } from "coral-stream/__generated__/PermalinkViewQueryLocal.graphql";

import { useStaticFlattenReplies } from "../helpers";
import PermalinkViewContainer from "./PermalinkViewContainer";

interface Props {
  local: Local;
}

export const render = ({ error, props }: QueryRenderData<QueryTypes>) => {
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
      <PermalinkViewContainer
        viewer={props.viewer}
        settings={props.settings}
        comment={props.comment}
        story={props.story}
      />
    );
  }
  return (
    <Delay>
      <Spinner />
    </Delay>
  );
};

const PermalinkViewQuery: FunctionComponent<Props> = ({
  local: { commentID, storyID, storyURL },
}) => {
  const handleIncompleteAccount = useHandleIncompleteAccount();
  const flattenReplies = useStaticFlattenReplies();
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query PermalinkViewQuery(
          $commentID: ID!
          $storyID: ID
          $storyURL: String
          $flattenReplies: Boolean!
        ) {
          viewer {
            ...PermalinkViewContainer_viewer
          }
          story(id: $storyID, url: $storyURL) {
            ...PermalinkViewContainer_story
          }
          comment(id: $commentID) {
            ...PermalinkViewContainer_comment
          }
          settings {
            ...PermalinkViewContainer_settings
          }
        }
      `}
      variables={{
        commentID: commentID!,
        storyID,
        storyURL,
        flattenReplies,
      }}
      render={(data) => {
        if (handleIncompleteAccount(data)) {
          return null;
        }
        return render(data);
      }}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment PermalinkViewQueryLocal on Local {
      storyID
      commentID
      storyURL
    }
  `
)(PermalinkViewQuery);

export default enhanced;
