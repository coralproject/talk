import { useRouter } from "found";
import { setLongTimeout } from "long-settimeout";
import { ReactNode, useContext } from "react";

import { NotificationContext } from "./GlobalNotificationContext";

function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  const [state, dispatch] = context;

  const { router } = useRouter();

  const setMessage = (message: ReactNode, timeout?: number) => {
    dispatch({ type: "SET_MESSAGE", message });
    if (timeout) {
      setLongTimeout(() => {
        dispatch({ type: "CLEAR_MESSAGE" });
      }, timeout);
    }
    router.addNavigationListener(() => {
      dispatch({ type: "CLEAR_MESSAGE" });
      return true;
    });
  };

  const clearMessage = () => dispatch({ type: "CLEAR_MESSAGE" });
  return {
    state,
    dispatch,
    setMessage,
    clearMessage,
  };
}

export default useNotification;
