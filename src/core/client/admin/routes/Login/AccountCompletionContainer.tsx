import { RouterState, withRouter } from "found";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import {
  useMutation,
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";

import { AccountCompletionContainer_auth } from "coral-admin/__generated__/AccountCompletionContainer_auth.graphql";
import { AccountCompletionContainer_viewer } from "coral-admin/__generated__/AccountCompletionContainer_viewer.graphql";
import { AccountCompletionContainerLocal } from "coral-admin/__generated__/AccountCompletionContainerLocal.graphql";

import CompleteAccountMutation from "./CompleteAccountMutation";
import SetAuthViewMutation, { SetAuthViewInput } from "./SetAuthViewMutation";

interface Props extends RouterState {
  local: AccountCompletionContainerLocal;
  auth: AccountCompletionContainer_auth;
  viewer: AccountCompletionContainer_viewer | null;
}

const AccountCompletionContainer: FunctionComponent<Props> = ({
  local,
  auth,
  viewer,
  children,
  router,
}) => {
  const completeAccount = useMutation(CompleteAccountMutation);
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const setAuthView = useMutation(SetAuthViewMutation);
  const redirect = useCallback(
    (view: SetAuthViewInput["view"]) => {
      if (local.authView !== view) {
        setAuthView({ view });
      }
    },
    [local, setAuthView]
  );

  useEffect(() => {
    // If we've already been marked as completed, stop now.
    if (completed) {
      return;
    }

    // Mark that we checked the completion status.
    setChecked(true);

    // If there is no viewer, exit now!
    if (!viewer) {
      return;
    }

    // Check if the user has an email address.
    if (!viewer.email) {
      // The email is not set on the viewer, check to see if the duplicate email
      // was detected via the `ADD_EMAIL_ADDRESS` process (indicated via
      // `authDuplicateEmail`) or from social login (indicated via
      // `viewer.duplicateEmail`). If they're already at the `ADD_EMAIL_ADDRESS`
      // view we don't need to change that.
      if (
        (local.authDuplicateEmail || viewer.duplicateEmail) &&
        local.authView !== "ADD_EMAIL_ADDRESS"
      ) {
        redirect("LINK_ACCOUNT");
        return;
      }

      redirect("ADD_EMAIL_ADDRESS");
      return;
    }

    // Check if the user has a username.
    if (!viewer.username) {
      // The username is not set on the viewer, ensure we're on the create
      // username view.
      redirect("CREATE_USERNAME");
      return;
    }

    // Check if the user has a password (and if they need one).
    if (
      !viewer.profiles.some((p) => p.__typename === "LocalProfile") &&
      auth.integrations.local.enabled &&
      auth.integrations.local.targetFilter.admin
    ) {
      // The password is not set on the viewer and the password is configured on
      // the admin area.
      redirect("CREATE_PASSWORD");
      return;
    }

    // Create a callback finish function that will redirect the user once the
    // access token has been set in the store.
    async function finish() {
      try {
        await completeAccount({ accessToken: local.accessToken! });
        router.replace(local.redirectPath || "/admin");
      } catch (err) {
        window.console.error(err);
      }
    }

    // Looks like the account is complete! Finish the account setup.
    void finish();

    // Mark the account as completed.
    setCompleted(true);
  }, [
    completed,
    setChecked,
    viewer,
    auth,
    redirect,
    local,
    router,
    completeAccount,
    setCompleted,
  ]);

  // If we haven't checked or we haven't completed the account, then render
  // nothing.
  if (!checked || completed) {
    return null;
  }

  return <>{children}</>;
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment AccountCompletionContainerLocal on Local {
      accessToken
      authView
      authDuplicateEmail
      redirectPath
    }
  `
)(
  withFragmentContainer<Props>({
    auth: graphql`
      fragment AccountCompletionContainer_auth on Auth {
        integrations {
          local {
            enabled
            targetFilter {
              admin
              stream
            }
          }
        }
      }
    `,
    viewer: graphql`
      fragment AccountCompletionContainer_viewer on User {
        username
        email
        duplicateEmail
        profiles {
          __typename
        }
      }
    `,
  })(withRouter(AccountCompletionContainer))
);

export default enhanced;
