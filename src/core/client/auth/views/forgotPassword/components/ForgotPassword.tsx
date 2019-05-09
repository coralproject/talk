import React, { FunctionComponent, useState } from "react";

import CheckEmail from "./CheckEmail";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPassword: FunctionComponent = () => {
  const [checkEmail, setCheckEmail] = useState<string | null>(null);
  return checkEmail ? (
    <CheckEmail email={checkEmail} />
  ) : (
    <ForgotPasswordForm onCheckEmail={setCheckEmail} />
  );
};

export default ForgotPassword;
