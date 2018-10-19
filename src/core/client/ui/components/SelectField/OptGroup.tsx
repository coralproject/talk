import React from "react";
import { StatelessComponent } from "react";

export interface OptGroupProps {
  label: string;
  children?: React.ReactNode;
}

const OptionGroup: StatelessComponent<OptGroupProps> = props => {
  return <optgroup {...props} />;
};

export default OptionGroup;
