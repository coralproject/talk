import { FormApi } from "final-form";
import React from "react";

import { InvalidRequestError } from "coral-framework/lib/errors";

import { AddSubmitHook, SubmitHook, SubmitHookContextProvider } from "./";

interface Props {
  onExecute: (data: any, form: FormApi) => Promise<void>;
  children: (params: {
    onSubmit: (settings: any, form: FormApi) => void;
  }) => React.ReactNode;
}

/**
 * SubmitHookContainer provides the SubmitHook Context and will
 * run all hooks when calling the `onSubmit` render prop.
 * If the submit was not cancelled, `onExecute` will be called in
 * the end, e.g. to call the mutation with the final data.
 */
class SubmitHookContainer extends React.Component<Props> {
  private submitHooks: SubmitHook[] = [];

  private handleSave = async (data: any, form: FormApi) => {
    let cancelled = false;
    let formErrors: Record<string, React.ReactNode> = {};
    const executeCallbacks: Array<() => Promise<any>> = [];
    const cancel = (errors: Record<string, React.ReactNode>) => {
      cancelled = true;
      formErrors = { ...errors, ...formErrors };
    };
    const onExecute = (cb: () => Promise<any>) => {
      executeCallbacks.push(cb);
    };
    try {
      // Call submit hooks, that can manipulate what
      // we send as the mutation.
      let nextData = data;
      for (const hook of this.submitHooks) {
        const result = await hook(nextData, { cancel, onExecute });
        if (result) {
          nextData = result;
        }
      }
      if (cancelled) {
        return formErrors;
      }

      executeCallbacks.push(() => this.props.onExecute(nextData, form));
      for (const c of executeCallbacks.map((cb) => cb())) {
        await c;
      }
    } catch (error) {
      if (error instanceof InvalidRequestError) {
        return error.invalidArgs;
      }
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return;
  };

  private addSubmitHook: AddSubmitHook = (hook) => {
    this.submitHooks.push(hook);
    return () => {
      this.submitHooks = this.submitHooks.filter((h) => h !== hook);
    };
  };

  public render() {
    return (
      <>
        <SubmitHookContextProvider value={this.addSubmitHook}>
          {this.props.children({
            onSubmit: this.handleSave,
          })}
        </SubmitHookContextProvider>
      </>
    );
  }
}

export default SubmitHookContainer;
