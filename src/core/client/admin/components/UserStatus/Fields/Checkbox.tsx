import { useField } from "formik";
import React, { FunctionComponent } from "react";

import { CheckBox } from "coral-ui/components/v2";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  children: React.ReactNode;
}

const Checkbox: FunctionComponent<Props> = ({ name, children, ...rest }) => {
  const [field] = useField(name);
  return (
    <CheckBox {...field} {...rest}>
      {children}
    </CheckBox>
  );
};

export default Checkbox;
