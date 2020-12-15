import { useField } from "formik";
import React, { FunctionComponent } from "react";

import { RadioButton as StockRadioButton } from "coral-ui/components/v2";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  children: React.ReactNode;
  value?: string;
  disabled?: boolean;
}

const RadioButton: FunctionComponent<Props> = ({ name, children, ...rest }) => {
  const [field] = useField(name);
  return (
    <StockRadioButton {...field} {...rest}>
      {children}
    </StockRadioButton>
  );
};

export default RadioButton;
