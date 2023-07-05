import { useCallback } from "react";

import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import { SignOutMutation } from "coral-stream/mutations";

/**
 * useHandleIncompleteAccount logs out a user when it
 * encounters a `USER_NOT_ENTITLED` during a query. It accepts
 * `data` from a `QueryRenderer`. Should only be used on Queries
 * that normally does not fail except when the account
 * is incomplete. Returns `true` if account was incomplete.
 */
const useHandleIncompleteAccount = () => {
  const signOut = useMutation(SignOutMutation);
  return useCallback(
    (data: { error: Error | null }) => {
      if (
        data.error instanceof InvalidRequestError &&
        data.error.code === ERROR_CODES.USER_NOT_ENTITLED
      ) {
        // eslint-disable-next-line
        console.warn("Coral: User account is incomplete. Perform logout.");
        void signOut();
        return true;
      }
      return false;
    },
    [signOut]
  );
};

export default useHandleIncompleteAccount;
