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
import { Delay } from "coral-ui/components";

import { ConfigureQuery as QueryTypes } from "coral-stream/__generated__/ConfigureQuery.graphql";
import { ConfigureQueryLocal as Local } from "coral-stream/__generated__/ConfigureQueryLocal.graphql";

const loadConfigureContainer = () =>
  import("./ConfigureContainer" /* webpackChunkName: "configure" */);
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
    if (!props.viewer) {
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
          viewer={props.viewer}
          organization={props.organization}
          story={props.story}
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

const ConfigureQuery: FunctionComponent<Props> = ({
  local: { storyID, storyURL, siteID },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query ConfigureQuery($storyID: ID, $storyURL: String, $siteID: String) {
        story(id: $storyID, url: $storyURL, siteID: $siteID) {
          ...ConfigureContainer_story
        }
        viewer {
          ...ConfigureContainer_viewer
        }
        organization {
          ...ConfigureContainer_organization
        }
      }
    `}
    variables={{
      storyID,
      storyURL,
      siteID,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer(
  graphql`
    fragment ConfigureQueryLocal on Local {
      storyID
      storyURL
      siteID
    }
  `
)(ConfigureQuery);

export default enhanced;
