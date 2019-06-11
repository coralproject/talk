import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { MutationProp, withMutation } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";

import AddEmailAddress from "./AddEmailAddress";
import SetEmailMutation from "./SetEmailMutation";

interface Props {
  setEmail: MutationProp<typeof SetEmailMutation>;
}

class AddEmailAddressContainer extends Component<Props> {
  private handleSubmit: PropTypesOf<
    typeof AddEmailAddress
  >["onSubmit"] = async (input, form) => {
    try {
      await this.props.setEmail({ email: input.email });
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };

  public render() {
    // tslint:disable-next-line:no-empty
    return <AddEmailAddress onSubmit={this.handleSubmit} />;
  }
}

const enhanced = withMutation(SetEmailMutation)(AddEmailAddressContainer);
export default enhanced;
