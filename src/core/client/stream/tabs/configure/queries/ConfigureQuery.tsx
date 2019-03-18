import { Localized } from "fluent-react/compat";
import { once } from "lodash";
import React, { StatelessComponent, Suspense } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { ConfigureQuery as QueryTypes } from "talk-stream/__generated__/ConfigureQuery.graphql";
import { ConfigureQueryLocal as Local } from "talk-stream/__generated__/ConfigureQueryLocal.graphql";
import { Delay, Spinner } from "talk-ui/components";

const loadConfigureContainer = () =>
  import("../containers/ConfigureContainer" /* webpackChunkName: "configure" */);
// (cvle) For some reason without `setTimeout` this request will block other requests.
const preloadConfigureContainer = once(() =>
  setTimeout(loadConfigureContainer)
);

const LazyConfigureContainer = React.lazy(loadConfigureContainer);

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
  preloadConfigureContainer();

  if (props) {
    if (!props.me) {
      return (
        <Localized id="configure-configureQuery-errorLoadingConfigure">
          <div>Error loading configure</div>
        </Localized>
      );
    }
    if (!props.story) {
      return (
        <Localized id="configure-configureQuery-storyNotFound">
          <div>Story not found</div>
        </Localized>
      );
    }
    return (
      <Suspense fallback={<Spinner />}>
        <LazyConfigureContainer
          me={props.me}
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
