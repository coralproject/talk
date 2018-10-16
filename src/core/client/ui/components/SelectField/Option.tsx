import React from "react";
import { StatelessComponent } from "react";

export interface OptionProps {
  value?: string;
  disabled?: boolean;
  hidden?: boolean;
  children?: React.ReactNode;
}

const Option: StatelessComponent<OptionProps> = props => {
  return <option {...props} />;
};

export default Option;
