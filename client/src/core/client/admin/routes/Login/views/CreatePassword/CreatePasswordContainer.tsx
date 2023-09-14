import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { MutationProp, withMutation } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";

import CreatePassword from "./CreatePassword";
import SetPasswordMutation from "./SetPasswordMutation";

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
      return;
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };

  public render() {
    // eslint-disable-next-line:no-empty
    return <CreatePassword onSubmit={this.handleSubmit} />;
  }
}

const enhanced = withMutation(SetPasswordMutation)(CreatePasswordContainer);
export default enhanced;
