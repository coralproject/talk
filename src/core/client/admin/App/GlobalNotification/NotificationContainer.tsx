import React, { FunctionComponent } from "react";

import useNotification from "./useNotification";

const NotificationContainer: FunctionComponent<{}> = () => {
  const { state } = useNotification();
  if (!state.visible) {
    return null;
  }
  return <div role="status">{state.message}</div>;
};

export default NotificationContainer;
