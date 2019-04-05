import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { SetPasswordMutation } from "talk-admin/mutations";
import { MutationProp, withMutation } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";

import CreatePassword from "../components/CreatePassword";

interface Props {
  setPassword: MutationProp<typeof SetPasswordMutation>;
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

const enhanced = withMutation(SetPasswordMutation)(CreatePasswordContainer);
export default enhanced;
