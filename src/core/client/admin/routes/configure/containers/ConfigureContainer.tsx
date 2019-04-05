import { FormApi, FormState } from "final-form";
import React from "react";

import { UpdateSettingsMutation } from "talk-admin/mutations";
import { SubmitHookHandler } from "talk-framework/lib/form";
import { MutationProp, withMutation } from "talk-framework/lib/relay";

import Configure from "../components/Configure";
import NavigationWarningContainer from "./NavigationWarningContainer";

interface Props {
  updateSettings: MutationProp<typeof UpdateSettingsMutation>;
  children: React.ReactElement;
}

interface State {
  dirty: boolean;
}

class ConfigureContainer extends React.Component<Props, State> {
  public state: State = {
    dirty: false,
  };

  private handleExecute = async (
    data: Parameters<Props["updateSettings"]>[0]["settings"],
    form: FormApi
  ) => {
    await this.props.updateSettings({ settings: data });
    form.initialize(data);
  };

  private handleChange = ({ dirty }: FormState) => {
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

const enhanced = withMutation(UpdateSettingsMutation)(ConfigureContainer);
export default enhanced;
