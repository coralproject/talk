import { FormApi, FormState } from "final-form";
import React from "react";

import { LanguageCode } from "coral-common/helpers/i18n";
import { CoralContext, withContext } from "coral-framework/lib/bootstrap";
import { SubmitHookHandler } from "coral-framework/lib/form";
import { MutationProp, withMutation } from "coral-framework/lib/relay";

import Configure from "./Configure";
import NavigationWarningContainer from "./NavigationWarningContainer";
import UpdateSettingsMutation from "./UpdateSettingsMutation";

interface Props {
  changeLocale: CoralContext["changeLocale"];
  updateSettings: MutationProp<typeof UpdateSettingsMutation>;
  children: React.ReactElement;
}

interface State {
  dirty: boolean;
}

class ConfigureRoute extends React.Component<Props, State> {
  public state: State = {
    dirty: false,
  };

  private handleExecute = async (
    data: Parameters<Props["updateSettings"]>[0]["settings"],
    form: FormApi
  ) => {
    await this.props.updateSettings({ settings: data });
    const localeFieldState = form.getFieldState("locale");
    if (localeFieldState && localeFieldState.dirty) {
      await this.props.changeLocale(data.locale as LanguageCode);
    }
    form.initialize(data);
  };

  private handleChange = ({ dirty }: FormState<any>) => {
    if (dirty !== this.state.dirty) {
      this.setState({ dirty });
    }
  };

  public render() {
    return (
      <>
        <NavigationWarningContainer active={this.state.dirty} />
        <SubmitHookHandler onExecute={this.handleExecute}>
          {({ onSubmit }) => (
            <Configure onChange={this.handleChange} onSubmit={onSubmit}>
              {this.props.children}
            </Configure>
          )}
        </SubmitHookHandler>
      </>
    );
  }
}

const enhanced = withContext(({ changeLocale }) => ({ changeLocale }))(
  withMutation(UpdateSettingsMutation)(ConfigureRoute)
);

export default enhanced;
