import { FormApi } from "final-form";
import { merge } from "lodash";
import React from "react";

interface Props {
  form: FormApi;
  rootKey?: string;
  children: (params: { onInitValues: (data: any) => void }) => React.ReactNode;
}

/**
 * FormInitializer exposes `onInitValues` property as a render prop.
 * This prop can be called multiple times until `FormInitializer` will
 * run `form.initizalize` during mount.
 *
 * This is useful if you're initialization data is spread across components.
 */
class FormInitializer extends React.Component<Props> {
  private initialValues: any = {};

  public componentDidMount() {
    let values = this.initialValues;
    if (this.props.rootKey) {
      values = { [this.props.rootKey]: values };
    }
    this.props.form.initialize(values);
  }

  private handlePartialInit = (values: any) => {
    this.initialValues = merge({}, this.initialValues, values);
  };

  public render() {
    return this.props.children({
      onInitValues: this.handlePartialInit,
    });
  }
}

export default FormInitializer;
