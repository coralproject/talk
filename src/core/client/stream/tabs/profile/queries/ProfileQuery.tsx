import { Localized } from "fluent-react/compat";
import { once } from "lodash";
import React, { FunctionComponent, Suspense } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { ProfileQuery as QueryTypes } from "talk-stream/__generated__/ProfileQuery.graphql";
import { ProfileQueryLocal as Local } from "talk-stream/__generated__/ProfileQueryLocal.graphql";
import { Delay, Spinner } from "talk-ui/components";

const loadProfileContainer = () =>
  import("../containers/ProfileContainer" /* webpackChunkName: "profile" */);
// (cvle) For some reason without `setTimeout` this request will block other requests.
const preloadProfileContainer = once(() => setTimeout(loadProfileContainer));

const LazyProfileContainer = React.lazy(loadProfileContainer);

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

  // TODO: use official React API once it has one :-)
  preloadProfileContainer();

  if (props) {
    if (!props.viewer) {
      return (
        <Localized id="profile-profileQuery-errorLoadingProfile">
          <div>Error loading profile</div>
        </Localized>
      );
    }
    if (!props.story) {
      return (
        <Localized id="profile-profileQuery-storyNotFound">
          <div>Story not found</div>
        </Localized>
      );
    }
    return (
      <Suspense fallback={<Spinner />}>
        <LazyProfileContainer
          viewer={props.viewer}
          story={props.story}
          settings={props.settings}
        />
      </Suspense>
    );
  }

  return (
    <Delay>
      <Spinner />
    </Delay>
  );
};

const ProfileQuery: FunctionComponent<Props> = ({
  local: { storyID, storyURL },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query ProfileQuery($storyID: ID, $storyURL: String) {
        story(id: $storyID, url: $storyURL) {
          ...ProfileContainer_story
        }
        viewer {
          ...ProfileContainer_viewer
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
