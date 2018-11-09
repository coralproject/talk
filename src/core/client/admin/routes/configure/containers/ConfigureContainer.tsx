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

interface Props {
  localeBundles: TalkContext["localeBundles"];
  router: Router;
  updateSettings: UpdateSettingsMutation;
  children: React.ReactNode;
}

class ConfigureContainer extends React.Component<Props> {
  private dirty = false;
  private removeTransitionHook: () => void;

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
    settings: UpdateSettingsInput["settings"],
    form: FormApi
  ) => {
    try {
      await this.props.updateSettings({ settings });
      form.initialize(settings);
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

  public render() {
    return (
      <Configure onChange={this.handleChange} onSave={this.handleSave}>
        {this.props.children}
      </Configure>
    );
  }
}

const enhanced = withContext(({ localeBundles }) => ({ localeBundles }))(
  withUpdateSettingsMutation(ConfigureContainer)
);
export default enhanced;
