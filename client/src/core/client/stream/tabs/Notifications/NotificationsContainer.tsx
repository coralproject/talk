import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { NotificationsContainer_viewer } from "coral-stream/__generated__/NotificationsContainer_viewer.graphql";

import NotificationsListQuery from "./NotificationsListQuery";

interface Props {
  viewer: NotificationsContainer_viewer;
}

const NotificationsContainer: FunctionComponent<Props> = ({ viewer }) => {
  return <NotificationsListQuery viewerID={viewer.id} />;
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment NotificationsContainer_viewer on User {
      id
    }
  `,
})(NotificationsContainer);

export default enhanced;
