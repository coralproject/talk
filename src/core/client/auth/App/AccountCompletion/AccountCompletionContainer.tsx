import React, { FunctionComponent, useEffect, useMemo } from "react";
import { graphql, useFragment } from "react-relay";

import { SetViewMutation } from "coral-auth/mutations";
import { View } from "coral-auth/mutations/SetViewMutation";
import { useLocal, useMutation } from "coral-framework/lib/relay";

import { AccountCompletionContainer_auth$key as AccountCompletionContainer_auth } from "coral-auth/__generated__/AccountCompletionContainer_auth.graphql";
import { AccountCompletionContainer_viewer$key as AccountCompletionContainer_viewer } from "coral-auth/__generated__/AccountCompletionContainer_viewer.graphql";
import { AccountCompletionContainerLocal } from "coral-auth/__generated__/AccountCompletionContainerLocal.graphql";

import CompleteAccountMutation from "./CompleteAccountMutation";

interface Props {
  auth: AccountCompletionContainer_auth;
  viewer: AccountCompletionContainer_viewer | null;
}

const AccountCompletionContainer: FunctionComponent<Props> = ({
  viewer,
  auth,
  children,
}) => {
  const authData = useFragment(
    graphql`
      fragment AccountCompletionContainer_auth on Auth {
        integrations {
          local {
            enabled
            targetFilter {
              stream
            }
          }
        }
      }
    `,
    auth
  );
  const viewerData = useFragment(
    graphql`
      fragment AccountCompletionContainer_viewer on User {
        username
        email
        duplicateEmail
        profiles {
          __typename
        }
      }
    `,
    viewer
  );

  const completeAccount = useMutation(CompleteAccountMutation);
  const setView = useMutation(SetViewMutation);

  const [{ view: currentView, accessToken, duplicateEmail }] = useLocal<
    AccountCompletionContainerLocal
  >(graphql`
    fragment AccountCompletionContainerLocal on Local {
      accessToken
      view
      duplicateEmail
    }
  `);

  const localProfileEnabled =
    authData.integrations.local.enabled &&
    authData.integrations.local.targetFilter.stream;

  const hasUsername = !!viewerData?.username;
  const hasEmail = !!viewerData?.email;
  const hasLocalProfile = !!viewerData?.profiles.some(
    (p) => p.__typename === "LocalProfile"
  );

  const view: View | false = useMemo(() => {
    // We aren't logged in or we don't have the token, so just stick with the
    // current view.
    if (!viewerData || !accessToken) {
      return currentView as View;
    }

    // If we don't have the email address, then link or add the email address to
    // the account.
    if (!hasEmail) {
      if (
        (duplicateEmail || viewerData.duplicateEmail) &&
        // User with a duplicate email might choose to use
        // a different email address instead of linking.
        currentView !== "ADD_EMAIL_ADDRESS"
      ) {
        return "LINK_ACCOUNT";
      }

      return "ADD_EMAIL_ADDRESS";
    }

    // If we don't have the username, then create one.
    if (!hasUsername) {
      return "CREATE_USERNAME";
    }

    // If the local profile is enabled, and we don't have a local profile, then
    // create one.
    if (localProfileEnabled && !hasLocalProfile) {
      return "CREATE_PASSWORD";
    }

    // We have a complete account! Finish the authentication flow and send the
    // token back to the page.
    void completeAccount({ accessToken });

    return false;
  }, [
    accessToken,
    completeAccount,
    currentView,
    duplicateEmail,
    hasEmail,
    hasLocalProfile,
    hasUsername,
    localProfileEnabled,
    viewerData,
  ]);

  // If the view is different than the current view, then set the view!
  useEffect(() => {
    if (!view || currentView === view) {
      return;
    }

    setView({ view });
  }, [currentView, setView, view]);

  // If we are redirecting or there is no view to use, then don't render the
  // children.
  if (!view || view !== currentView) {
    return null;
  }

  return <>{children}</>;
};

export default AccountCompletionContainer;
