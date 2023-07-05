import React, { FunctionComponent } from "react";

export interface OptionProps {
  value?: string;
  disabled?: boolean;
  hidden?: boolean;
  children?: React.ReactNode;
}

const Option: FunctionComponent<OptionProps> = (props) => {
  return <option {...props} />;
};

export default Option;
