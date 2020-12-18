import { useField } from "formik";
import React, { FunctionComponent } from "react";

import { CheckBox as CheckBoxComponent } from "coral-ui/components/v2";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  children: React.ReactNode;
}

const CheckBox: FunctionComponent<Props> = ({ name, children, ...rest }) => {
  const [field] = useField(name);
  return (
    <CheckBoxComponent {...field} {...rest}>
      {children}
    </CheckBoxComponent>
  );
};

export default CheckBox;
