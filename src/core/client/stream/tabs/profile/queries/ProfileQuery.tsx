import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { ProfileQuery as QueryTypes } from "talk-stream/__generated__/ProfileQuery.graphql";
import { ProfileQueryLocal as Local } from "talk-stream/__generated__/ProfileQueryLocal.graphql";
import { Spinner } from "talk-ui/components";

import ProfileContainer from "../containers/ProfileContainer";

interface InnerProps {
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
        <Localized id="profile-profileQuery-errorLoadingProfile">
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
      <ProfileContainer
        me={props.me}
        story={props.story}
        settings={props.settings}
      />
    );
  }

  return <Spinner />;
};

const ProfileQuery: StatelessComponent<InnerProps> = ({
  local: { storyID, storyURL },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query ProfileQuery($storyID: ID, $storyURL: String) {
        story(id: $storyID, url: $storyURL) {
          ...ProfileContainer_story
        }
        me {
          ...ProfileContainer_me
        }
        settings {
          ...ProfileContainer_settings
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
    fragment ProfileQueryLocal on Local {
      storyID
      storyURL
    }
  `
)(ProfileQuery);

export default enhanced;
