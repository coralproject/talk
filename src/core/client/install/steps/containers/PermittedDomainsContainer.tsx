import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { PropTypesOf } from "coral-ui/types";

import PermittedDomains, {
  PermittedDomainsForm,
} from "../components/PermittedDomains";

interface PermittedDomainsContainerProps {
  onGoToNextStep: () => void;
  onGoToPreviousStep: () => void;
  data: PropTypesOf<typeof PermittedDomains>["data"];
  onInstall: (
    newData: PropTypesOf<typeof PermittedDomains>["data"]
  ) => Promise<void>;
}

class PermittedDomainsContainer extends Component<
  PermittedDomainsContainerProps
> {
  private onSubmit: PermittedDomainsForm["onSubmit"] = async (input, form) => {
    try {
      const domains = input.domains.split(",");
      await this.props.onInstall({ domains });
      return this.props.onGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return (
      <PermittedDomains
        data={this.props.data}
        onSubmit={this.onSubmit}
        onGoToPreviousStep={this.props.onGoToPreviousStep}
      />
    );
  }
}

export default PermittedDomainsContainer;
