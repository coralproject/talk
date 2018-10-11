import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { PropTypesOf } from "talk-ui/types";

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
  private onGoToNextStep = () => {
    if (this.props.onGoToNextStep) {
      this.props.onGoToNextStep();
    }
  };
  private onGoToPreviousStep = () => {
    if (this.props.onGoToPreviousStep) {
      this.props.onGoToPreviousStep();
    }
  };
  private onSubmit: PermittedDomainsForm["onSubmit"] = async (input, form) => {
    try {
      const domains = input.domains.split(",");
      await this.props.onInstall({ domains });
      return this.onGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return (
      <PermittedDomains
        data={this.props.data}
        onSubmit={this.onSubmit}
        onGoToPreviousStep={this.onGoToPreviousStep}
      />
    );
  }
}

export default PermittedDomainsContainer;
