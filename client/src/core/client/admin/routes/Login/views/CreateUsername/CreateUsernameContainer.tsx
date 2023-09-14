import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { MutationProp, withMutation } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";

import CreateUsername from "./CreateUsername";
import SetUsernameMutation from "./SetUsernameMutation";

interface Props {
  setUsername: MutationProp<typeof SetUsernameMutation>;
}

class CreateUsernameContainer extends Component<Props> {
  private handleSubmit: PropTypesOf<typeof CreateUsername>["onSubmit"] = async (
    input,
    form
  ) => {
    try {
      await this.props.setUsername({ username: input.username });
      return;
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };

  public render() {
    // eslint-disable-next-line:no-empty
    return <CreateUsername onSubmit={this.handleSubmit} />;
  }
}

const enhanced = withMutation(SetUsernameMutation)(CreateUsernameContainer);
export default enhanced;
