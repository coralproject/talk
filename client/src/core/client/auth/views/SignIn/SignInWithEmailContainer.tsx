import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";

import { getViewURL } from "coral-auth/helpers";
import { SetViewMutation } from "coral-auth/mutations";
import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { useMutation } from "coral-framework/lib/relay";

import SignInMutation from "./SignInMutation";
import SignInWithEmail, { SignInWithEmailForm } from "./SignInWithEmail";

const SignInContainer: FunctionComponent = () => {
  const { window } = useCoralContext();
  const signIn = useMutation(SignInMutation);
  const setView = useMutation(SetViewMutation);
  const onSubmit: SignInWithEmailForm["onSubmit"] = useCallback(
    async (input, form) => {
      try {
        await signIn({ email: input.email, password: input.password });
        return;
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [signIn]
  );
  const goToForgotPassword = useCallback(
    (e: React.MouseEvent) => {
      setView({ view: "FORGOT_PASSWORD", history: "push" });
      if (e.preventDefault) {
        e.preventDefault();
      }
    },
    [setView]
  );

  return (
    <SignInWithEmail
      onSubmit={onSubmit}
      onGotoForgotPassword={goToForgotPassword}
      forgotPasswordHref={getViewURL("FORGOT_PASSWORD", window)}
    />
  );
};

export default SignInContainer;
