import { useFormikContext } from "formik";
import React, { FunctionComponent } from "react";

import { CallOut } from "coral-ui/components/v3";

const SignupError: FunctionComponent = () => {
  const { status } = useFormikContext();
  if (status && status.error) {
    return <CallOut title={status.error} color="error" />;
  }
  return null;
};

export default SignupError;
