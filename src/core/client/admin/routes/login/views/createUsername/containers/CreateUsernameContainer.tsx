import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { SetUsernameMutation } from "talk-admin/mutations";
import { MutationProp, withMutation } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";

import CreateUsername from "../components/CreateUsername";

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
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };

  public render() {
    // tslint:disable-next-line:no-empty
    return <CreateUsername onSubmit={this.handleSubmit} />;
  }
}

const enhanced = withMutation(SetUsernameMutation)(CreateUsernameContainer);
export default enhanced;
