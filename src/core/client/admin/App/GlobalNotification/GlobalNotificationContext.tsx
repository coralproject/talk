import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";

interface State {
  message: ReactNode | null;
  visible: boolean;
}

type Action =
  | {
      type: "SET_MESSAGE";
    } & State
  | {
      type: "HIDE_MESSAGE";
    };

// TODO (tessalt) can't figure out types for this
const NotificationContext = createContext<State | any>({
  message: null,
  visible: false,
});

function notificationReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MESSAGE": {
      return { message: action.message, visible: true };
    }
    case "HIDE_MESSAGE": {
      return { ...state, visible: false };
    }
    default: {
      throw new Error("unsupported action");
    }
  }
}

function NotificationProvider(props: any) {
  const [state, dispatch] = useReducer(notificationReducer, {
    message: null,
    visible: false,
  });
  const value = useMemo(() => [state, dispatch], [state]);
  return <NotificationContext.Provider value={value} {...props} />;
}

function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(`useCount must be used within a CountProvider`);
  }
  const [state, dispatch] = context;

  const setMessage = (message: ReactNode) =>
    dispatch({ type: "SET_MESSAGE", message });
  return {
    state,
    dispatch,
    setMessage,
  };
}

export { NotificationProvider, useNotification };
