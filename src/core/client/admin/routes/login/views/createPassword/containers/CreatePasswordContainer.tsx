import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import {
  SetPasswordMutation,
  withSetPasswordMutation,
} from "talk-admin/mutations/SetPasswordMutation";
import { PropTypesOf } from "talk-framework/types";

import CreatePassword from "../components/CreatePassword";

interface Props {
  setPassword: SetPasswordMutation;
}

class CreatePasswordContainer extends Component<Props> {
  private handleSubmit: PropTypesOf<typeof CreatePassword>["onSubmit"] = async (
    input,
    form
  ) => {
    try {
      await this.props.setPassword({ password: input.password });
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };

  public render() {
    // tslint:disable-next-line:no-empty
    return <CreatePassword onSubmit={this.handleSubmit} />;
  }
}

const enhanced = withSetPasswordMutation(CreatePasswordContainer);
export default enhanced;
