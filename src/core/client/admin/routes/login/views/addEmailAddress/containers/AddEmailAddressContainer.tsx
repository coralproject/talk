import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { SetEmailMutation } from "talk-admin/mutations";
import { MutationProp, withMutation } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";

import AddEmailAddress from "../components/AddEmailAddress";

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
