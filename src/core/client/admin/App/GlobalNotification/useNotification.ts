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

  const setMessage = (message: ReactNode, timeout?: number) => {
    dispatch({ type: "SET_MESSAGE", message });
    if (timeout) {
      setTimeout(() => {
        dispatch({ type: "CLEAR_MESSAGE" });
      }, timeout);
    }
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
