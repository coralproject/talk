import React from "react";

import SSOConfig from "./SSOConfig";

interface Props {
  disabled?: boolean;
}

const SSOConfigContainer: React.FunctionComponent<Props> = ({ disabled }) => {
  return <SSOConfig disabled={disabled} />;
};

export default SSOConfigContainer;
