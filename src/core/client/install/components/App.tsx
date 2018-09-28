import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import { OnSubmit } from "talk-framework/lib/form";
import * as styles from "./App.css";

import MainBar from "./MainBar";
import Wizard from "./Wizard";

import AddOrganization from "../steps/AddOrganization";
import InitialStep from "../steps/InitialStep";

interface FormData {
  organizationName: string;
  organizationContactEmail: string;

  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface AppState {
  step: number;
  data: FormData | {};
}

export interface Form {
  onSubmit: OnSubmit<FormData>;
}

class App extends Component<{}, AppState> {
  public state = {
    step: 0,
    data: {},
  };

  private nextStep = () =>
    this.setState(({ step }) => ({
      step: step + 1,
    }));

  private previousStep = () =>
    this.setState(({ step }) => ({
      step: step - 1,
    }));

  private goToStep = (step: number) =>
    this.setState({
      step,
    });

  private onSubmit: Form["onSubmit"] = async (
    newData: Partial<FormData>,
    form
  ) => {
    try {
      console.log("submiting data");

      this.setState(
        ({ data }) => ({
          data: { ...data, ...newData },
        }),
        () => {
          this.nextStep();
        }
      );
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };

  public render() {
    return (
      <div className={styles.root}>
        <MainBar />
        <div className={styles.container}>
          <Wizard
            currentStep={this.state.step}
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            goToStep={this.goToStep}
          >
            <InitialStep />
            <AddOrganization onSubmit={this.onSubmit} />
          </Wizard>
        </div>
      </div>
    );
  }
}

export default App;
