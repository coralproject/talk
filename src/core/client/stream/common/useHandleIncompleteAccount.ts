import { useCallback } from "react";

import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import { SignOutMutation } from "coral-stream/mutations";

const useHandleIncompleteAccount = () => {
  const signOut = useMutation(SignOutMutation);
  return useCallback(
    (data: { error: Error | null }) => {
      if (
        data.error instanceof InvalidRequestError &&
        data.error.code === ERROR_CODES.USER_NOT_ENTITLED
      ) {
        signOut();
      }
    },
    [signOut]
  );
};

export default useHandleIncompleteAccount;
