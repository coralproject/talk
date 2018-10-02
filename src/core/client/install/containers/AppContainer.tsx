import React, { Component } from "react";
import App from "../components/App";

export interface FormData {
  organizationName: string;
  organizationContactEmail: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  domains: string;
}

interface AppContainerState {
  data: Partial<FormData>;
}

class WizardContainer extends Component<{}, AppContainerState> {
  public state = {
    step: 0,
    data: {
      organizationContactEmail: "",
      organizationName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      domains: "",
    },
  };

  private saveData = (newData: Partial<FormData>) =>
    this.setState(({ data }) => ({
      data: { ...data, ...newData },
    }));

  public render() {
    return <App saveData={this.saveData} data={this.state.data} />;
  }
}

export default WizardContainer;
