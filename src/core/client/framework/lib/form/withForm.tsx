import { FormApi } from "final-form";
import React from "react";
import { useForm } from "react-final-form";
import {
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";

interface FormProps {
  form: FormApi<any>;
}
const withForm: InferableComponentEnhancer<FormProps> = hoistStatics<any>(
  (WrappedComponent: React.ComponentType<any>) => {
    const Component: React.FunctionComponent<any> = (props) => {
      const form = useForm<any>();
      return <WrappedComponent {...props} form={form} />;
    };
    Component.displayName = wrapDisplayName(WrappedComponent, "withForm");
    return Component as any;
  }
);

export default withForm;
