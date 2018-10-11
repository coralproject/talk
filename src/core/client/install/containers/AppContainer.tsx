import React, { Component } from "react";
import App from "../components/App";

export interface FormData {
  organizationName: string;
  organizationContactEmail: string;
  organizationURL: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  domains: string[];
}

interface AppContainerState {
  data: FormData;
}

class WizardContainer extends Component<{}, AppContainerState> {
  public state = {
    step: 0,
    data: {
      organizationContactEmail: "",
      organizationName: "",
      organizationURL: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      domains: [],
    },
  };

  private onSaveData = (newData: FormData) => {
    return new Promise<FormData>(resolve => {
      this.setState(
        ({ data }) => ({
          data: { ...data, ...newData },
        }),
        () => {
          resolve(this.state.data);
        }
      );
    });
  };

  public render() {
    return <App onSaveData={this.onSaveData} data={this.state.data} />;
  }
}

export default WizardContainer;
