import { Localized } from "@fluent/react/compat";
import { once } from "lodash";
import React, { FunctionComponent, Suspense } from "react";
import { graphql } from "react-relay";

import { polyfillCSSVars } from "coral-framework/helpers";
import {
  QueryRenderData,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import useHandleIncompleteAccount from "coral-stream/common/useHandleIncompleteAccount";
import { CallOut, Delay, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { ProfileQuery as QueryTypes } from "coral-stream/__generated__/ProfileQuery.graphql";
import { ProfileQueryLocal as Local } from "coral-stream/__generated__/ProfileQueryLocal.graphql";

const loadProfileContainer = () =>
  import("./ProfileContainer" /* webpackChunkName: "profile" */).then((x) => {
    // New css is loaded, take care of polyfilling those css vars for IE11.
    void polyfillCSSVars();
    return x;
  });
// (cvle) For some reason without `setTimeout` this request will block other requests.
const preloadProfileContainer = once(() => setTimeout(loadProfileContainer, 0));

const LazyProfileContainer = React.lazy(loadProfileContainer);

interface Props {
  local: Local;
}

export const render = ({ error, props }: QueryRenderData<QueryTypes>) => {
  if (error) {
    return <QueryError error={error} />;
  }

  // TODO: use official React API once it has one :-)
  preloadProfileContainer();

  if (props) {
    if (!props.viewer) {
      return (
        <Localized id="profile-profileQuery-errorLoadingProfile">
          <CallOut color="error" fullWidth aria-live="polite">
            Error loading profile
          </CallOut>
        </Localized>
      );
    }
    if (!props.story) {
      return (
        <Localized id="profile-profileQuery-storyNotFound">
          <CallOut aria-live="polite">Story not found</CallOut>
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
}) => {
  const handleIncompleteAccount = useHandleIncompleteAccount();
  return (
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
    fragment ProfileQueryLocal on Local {
      storyID
      storyURL
    }
  `
)(ProfileQuery);

export default enhanced;
