import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { NotificationContainer_notification } from "coral-stream/__generated__/NotificationContainer_notification.graphql";

import styles from "./NotificationContainer.css";

interface Props {
  notification: NotificationContainer_notification;
}

const NotificationContainer: FunctionComponent<Props> = ({
  notification: { title, body },
}) => {
  return (
    <div className={cn(styles.root)}>
      {title && <div className={cn(styles.title)}>{title}</div>}
      {body && <div className={cn(styles.body)}>{body}</div>}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment NotificationContainer_notification on Notification {
      id
      title
      body
      comment {
        id
        body
      }
    }
  `,
})(NotificationContainer);

export default enhanced;
