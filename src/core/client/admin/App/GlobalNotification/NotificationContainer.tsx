import React, { FunctionComponent } from "react";
import { useNotification } from "./GlobalNotificationContext";

const NotificationContainer: FunctionComponent<{}> = () => {
  const { state } = useNotification();
  return <div>{state.message}</div>;
};

export default NotificationContainer;
