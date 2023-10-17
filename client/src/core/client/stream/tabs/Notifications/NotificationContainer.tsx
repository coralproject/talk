import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { NotificationContainer_notification } from "coral-stream/__generated__/NotificationContainer_notification.graphql";

interface Props {
  notification: NotificationContainer_notification;
}

const NotificationContainer: FunctionComponent<Props> = ({ notification }) => {
  return <div>{notification.body}</div>;
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment NotificationContainer_notification on Notification {
      id
      body
    }
  `,
})(NotificationContainer);

export default enhanced;
