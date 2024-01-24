import { Localized } from "@fluent/react/compat";
import { once } from "lodash";
import React, { FunctionComponent, Suspense } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { Delay, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { NotificationsQuery as QueryTypes } from "coral-stream/__generated__/NotificationsQuery.graphql";

const loadNotificationsContainer = () =>
  import("./NotificationsContainer" /* webpackChunkName: "notifications" */);

// (cvle) For some reason without `setTimeout` this request will block other requests.
const preload = once(() =>
  setTimeout(() => {
    void loadNotificationsContainer();
  }, 0)
);

const LazyLoadContainer = React.lazy(loadNotificationsContainer);

export const render = (
  { error, props }: QueryRenderData<QueryTypes>,
  showUserBox = true
) => {
  if (error) {
    return <QueryError error={error} />;
  }

  preload();

  if (!props) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  if (!props.viewer) {
    return (
      <Localized id="notificationsQuery-errorLoading">
        <div>Error loading notifications</div>
      </Localized>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <LazyLoadContainer
        viewer={props.viewer}
        settings={props.settings}
        showUserBox={showUserBox}
      />
    </Suspense>
  );
};

interface Props {
  showUserBox?: boolean;
}

const NotificationsQuery: FunctionComponent<Props> = ({
  showUserBox = true,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query NotificationsQuery {
          viewer {
            ...NotificationsContainer_viewer
          }
          settings {
            ...NotificationsContainer_settings
          }
        }
      `}
      variables={{}}
      render={(data) => {
        return render(data, showUserBox);
      }}
    />
  );
};

export default NotificationsQuery;
