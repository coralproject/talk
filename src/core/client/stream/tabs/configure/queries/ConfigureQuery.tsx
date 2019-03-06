import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { ConfigureQuery as QueryTypes } from "talk-stream/__generated__/ConfigureQuery.graphql";
import { ConfigureQueryLocal as Local } from "talk-stream/__generated__/ConfigureQueryLocal.graphql";
import { Delay, Spinner } from "talk-ui/components";

import ConfigureContainer from "../containers/ConfigureContainer";

interface Props {
  local: Local;
}

export const render = ({
  error,
  props,
}: ReadyState<QueryTypes["response"]>) => {
  if (error) {
    return <div>{error.message}</div>;
  }

  if (props) {
    if (!props.me) {
      return (
        <Localized id="profile-profileQuery-errorLoadingConfigure">
          <div>Error loading profile</div>
        </Localized>
      );
    }
    if (!props.story) {
      return (
        <Localized id="comments-profileQuery-storyNotFound">
          <div>Story not found</div>
        </Localized>
      );
    }
    return (
      <ConfigureContainer
        me={props.me}
        story={props.story}
        settings={props.settings}
      />
    );
  }

  return (
    <Delay>
      <Spinner />
    </Delay>
  );
};

const ConfigureQuery: StatelessComponent<Props> = ({
  local: { storyID, storyURL },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query ConfigureQuery($storyID: ID, $storyURL: String) {
        story(id: $storyID, url: $storyURL) {
          ...ConfigureContainer_story
        }
        me {
          ...ConfigureContainer_me
        }
        settings {
          ...ConfigureContainer_settings
        }
      }
    `}
    variables={{
      storyID,
      storyURL,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer(
  graphql`
    fragment ConfigureQueryLocal on Local {
      storyID
      storyURL
    }
  `
)(ConfigureQuery);

export default enhanced;
