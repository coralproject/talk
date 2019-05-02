import React, { FunctionComponent, useCallback } from "react";

import { ForgotPasswordMutation } from "talk-auth/mutations";
import { InvalidRequestError } from "talk-framework/lib/errors";
import { useMutation } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-ui/types";

import ForgotPassword from "../components/ForgotPassword";

const ForgotPasswordContainer: FunctionComponent = () => {
  const forgotPassword = useMutation(ForgotPasswordMutation);
  const onSubmit = useCallback<PropTypesOf<typeof ForgotPassword>["onSubmit"]>(
    async ({ email }) => {
      try {
        await forgotPassword({
          email,
          redirectURI: window.location.href,
        });
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          return error.invalidArgs;
        }
        // tslint:disable-next-line:no-console
        console.error(error);
      }
      return;
    },
    [forgotPassword]
  );
  return <ForgotPassword onSubmit={onSubmit} />;
};

export default ForgotPasswordContainer;
