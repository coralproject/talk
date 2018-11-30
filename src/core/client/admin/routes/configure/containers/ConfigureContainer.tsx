import { FormApi, FormState } from "final-form";
import { Router } from "found";
import React from "react";

import {
  UpdateSettingsInput,
  UpdateSettingsMutation,
  withUpdateSettingsMutation,
} from "talk-admin/mutations";
import { TalkContext, withContext } from "talk-framework/lib/bootstrap";
import { BadUserInputError } from "talk-framework/lib/errors";
import { getMessage } from "talk-framework/lib/i18n";

import Configure from "../components/Configure";
import {
  AddSubmitHook,
  SubmitHook,
  SubmitHookContextProvider,
} from "../submitHook";

interface Props {
  localeBundles: TalkContext["localeBundles"];
  router: Router;
  updateSettings: UpdateSettingsMutation;
  children: React.ReactNode;
}

class ConfigureContainer extends React.Component<Props> {
  private dirty = false;
  private removeTransitionHook: () => void;
  private submitHooks: SubmitHook[] = [];

  constructor(props: Props) {
    super(props);

    this.dirty = false;

    const warningMessage = getMessage(
      props.localeBundles,
      "configure-unsavedInputWarning",
      "You have unsaved input. Are you sure you want to leave this page?"
    );

    this.removeTransitionHook = props.router.addTransitionHook(
      () => (this.dirty ? warningMessage : true)
    );
  }

  public componentWillUnmount() {
    this.removeTransitionHook();
  }

  private handleSave = async (
    data: UpdateSettingsInput["settings"],
    form: FormApi
  ) => {
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

      executeCallbacks.push(() =>
        this.props.updateSettings({ settings: nextData })
      );
      for (const c of executeCallbacks.map(cb => cb())) {
        await c;
      }
      form.initialize(data);
    } catch (error) {
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return undefined;
  };

  private handleChange = ({ dirty }: FormState) => {
    this.dirty = dirty;
  };

  private addSubmitHook: AddSubmitHook = hook => {
    this.submitHooks.push(hook);
    return () => {
      this.submitHooks = this.submitHooks.filter(h => h === hook);
    };
  };

  public render() {
    return (
      <SubmitHookContextProvider value={this.addSubmitHook}>
        <Configure onChange={this.handleChange} onSave={this.handleSave}>
          {this.props.children}
        </Configure>
      </SubmitHookContextProvider>
    );
  }
}

const enhanced = withContext(({ localeBundles }) => ({ localeBundles }))(
  withUpdateSettingsMutation(ConfigureContainer)
);
export default enhanced;
