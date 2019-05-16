import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import {
  SetEmailMutation,
  withSetEmailMutation,
} from "coral-auth/mutations/SetEmailMutation";
import { PropTypesOf } from "coral-framework/types";

import AddEmailAddress from "../components/AddEmailAddress";

interface Props {
  setEmail: SetEmailMutation;
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

const enhanced = withSetEmailMutation(AddEmailAddressContainer);
export default enhanced;
