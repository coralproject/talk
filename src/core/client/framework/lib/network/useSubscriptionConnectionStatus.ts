import { useEffect, useState } from "react";

import { useCoralContext } from "../bootstrap";
import { CONNECTION_STATUS } from "./";

const allStatus = [
  CONNECTION_STATUS.CONNECTED,
  CONNECTION_STATUS.CONNECTING,
  CONNECTION_STATUS.DISCONNECTED,
];

/**
 * Returns connection status of the graphql subscription client.
 * You can limit the status that you're interested in with `only`.
 */
export default function useSubscriptionConnectionStatus(
  only?: CONNECTION_STATUS[]
): CONNECTION_STATUS {
  const { subscriptionClient } = useCoralContext();
  const [status, setStatus] = useState(
    subscriptionClient.getConnectionStatus()
  );
  useEffect(() => {
    return subscriptionClient.on(only || allStatus, (s) => {
      setStatus(s);
    });
  }, [only, subscriptionClient]);
  return status;
}
