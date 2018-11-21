import { noop } from "lodash";
import React from "react";

export type SubmitHook = (
  data: any,
  actions: {
    // Callback will be called after all validations has passed and
    // the submit has not been cancelled.
    onExecute: (cb: () => Promise<any>) => void;
    cancel: (errors?: Record<string, React.ReactNode>) => void;
  }
) => Promise<any> | any;
export type RemoveSubmitHook = () => void;
export type AddSubmitHook = (hook: SubmitHook) => RemoveSubmitHook;
export type SubmitHookContext = AddSubmitHook;

const { Provider, Consumer } = React.createContext<SubmitHookContext>(
  () => noop
);

export const SubmitHookContextProvider = Provider;
export const SubmitHookContextConsumer = Consumer;
