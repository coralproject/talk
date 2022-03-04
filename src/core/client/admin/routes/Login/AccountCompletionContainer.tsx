import { useRouter } from "found";
import React, { FunctionComponent, useEffect, useMemo, useRef } from "react";
import { graphql, useFragment } from "react-relay";

import { SetRedirectPathMutation } from "coral-admin/mutations";
import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { globalErrorReporter } from "coral-framework/lib/errors/reporter";
import { useLocal, useMutation } from "coral-framework/lib/relay";

import { AccountCompletionContainer_auth$key as AccountCompletionContainer_auth } from "coral-admin/__generated__/AccountCompletionContainer_auth.graphql";
import { AccountCompletionContainer_viewer$key as AccountCompletionContainer_viewer } from "coral-admin/__generated__/AccountCompletionContainer_viewer.graphql";
import { AccountCompletionContainerLocal } from "coral-admin/__generated__/AccountCompletionContainerLocal.graphql";

import CompleteAccountMutation from "./CompleteAccountMutation";
import SetAuthViewMutation, { View } from "./SetAuthViewMutation";

interface Props {
  auth: AccountCompletionContainer_auth;
  viewer: AccountCompletionContainer_viewer | null;
}

const AccountCompletionContainer: FunctionComponent<Props> = ({
  auth,
  viewer,
  children,
}) => {
  const authData = useFragment(
    graphql`
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

  const completed = useRef<boolean>(false);
  const completeAccount = useMutation(CompleteAccountMutation);
  const setAuthView = useMutation(SetAuthViewMutation);
  const setRedirectPath = useMutation(SetRedirectPathMutation);
  const { window } = useCoralContext();
  const { router } = useRouter();

  const [
    {
      authView: currentView,
      accessToken,
      authDuplicateEmail: duplicateEmail,
      redirectPath,
    },
  ] = useLocal<AccountCompletionContainerLocal>(graphql`
    fragment AccountCompletionContainerLocal on Local {
      accessToken
      authView
      authDuplicateEmail
      redirectPath
    }
  `);

  const localProfileEnabled =
    authData.integrations.local.enabled &&
    authData.integrations.local.targetFilter.admin;

  const hasUsername = !!viewerData?.username;
  const hasEmail = !!viewerData?.email;
  const hasLocalProfile = !!viewerData?.profiles.some(
    (p) => p.__typename === "LocalProfile"
  );

  const view: View | false = useMemo(() => {
    if (completed.current) {
      return false;
    }
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

    async function finish() {
      try {
        // Initiate full user session. This will also reset local client state
        // and `authView` will restore to `SIGN_IN`.
        await completeAccount({ accessToken: accessToken! });
        await setRedirectPath({ path: null });

        // If the redirect path exists and does not start with /admin, then use
        // the `window.location.href` navigation, otherwise use the router.
        if (redirectPath && !redirectPath.startsWith("/admin")) {
          window.location.href = redirectPath;
        } else {
          const pathname = redirectPath || "/admin";
          // TODO: (cvle) for some reason having a GET Parameter at the end will lead to 404.
          // This seems to be an issue in found. Needs more investigation.
          if (pathname.includes("?")) {
            // Workaround for now.
            location.href = pathname;
          } else {
            router.replace({ pathname });
          }
        }
      } catch (err) {
        globalErrorReporter.report(err);
      }
    }

    // Looks like the account is complete! Finish the account setup.
    void finish();
    completed.current = true;

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
    redirectPath,
    router,
    setRedirectPath,
    viewerData,
    window.location,
  ]);

  // If the view is different than the current view, then set the view!
  useEffect(() => {
    if (!view || currentView === view) {
      return;
    }

    setAuthView({ view });
  }, [currentView, setAuthView, view]);

  // If we are redirecting or there is no view to use, then don't render the
  // children.
  if (!view || view !== currentView) {
    return null;
  }

  return <>{children}</>;
};

export default AccountCompletionContainer;
