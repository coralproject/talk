import { Localized } from "fluent-react/compat";
import { once } from "lodash";
import React, { FunctionComponent, Suspense } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import Spinner from "coral-stream/common/Spinner";
import { CallOut, Delay } from "coral-ui/components";

import { ProfileQuery as QueryTypes } from "coral-stream/__generated__/ProfileQuery.graphql";
import { ProfileQueryLocal as Local } from "coral-stream/__generated__/ProfileQueryLocal.graphql";

const loadProfileContainer = () =>
  import("./ProfileContainer" /* webpackChunkName: "profile" */);
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
    return (
      <CallOut color="error" fullWidth>
        {error.message}
      </CallOut>
    );
  }

  // TODO: use official React API once it has one :-)
  preloadProfileContainer();

  if (props) {
    if (!props.viewer) {
      return (
        <Localized id="profile-profileQuery-errorLoadingProfile">
          <CallOut color="error" fullWidth>
            Error loading profile
          </CallOut>
        </Localized>
      );
    }
    if (!props.story) {
      return (
        <Localized id="profile-profileQuery-storyNotFound">
          <CallOut>Story not found</CallOut>
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
        story: stream(id: $storyID, url: $storyURL) {
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
