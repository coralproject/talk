import React, { FunctionComponent } from "react";

export interface OptGroupProps {
  label: string;
  children?: React.ReactNode;
}

const OptionGroup: FunctionComponent<OptGroupProps> = (props) => {
  return <optgroup {...props} />;
};

export default OptionGroup;
