import { useRouter } from "found";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import { SetRedirectPathMutation } from "coral-admin/mutations";
import { canInGeneral, GeneralAbilityType } from "coral-admin/permissions";
import { roleIsAtLeast } from "coral-framework/helpers";
import { useMutation } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { GQLUSER_ROLE } from "coral-framework/schema";

import { AuthCheckRouteQueryResponse } from "coral-admin/__generated__/AuthCheckRouteQuery.graphql";

import NetworkError from "./NetworkError";
import RestrictedContainer from "./RestrictedContainer";

interface Props {
  data: AuthCheckRouteQueryResponse;
  error: Error | null;
  children?: React.ReactNode;
}

type CheckParams =
  | {
      role: GQLUSER_ROLE;
      ability?: GeneralAbilityType;
    }
  | {
      role?: GQLUSER_ROLE;
      ability: GeneralAbilityType;
    };

function createAuthCheckRoute(check: CheckParams) {
  const AuthCheckRoute: FunctionComponent<Props> = ({
    data,
    error,
    children,
  }) => {
    const { router, match } = useRouter();
    const [wasLoggedIn, setWasLoggedIn] = useState(false);
    const setRedirectPathMutation = useMutation(SetRedirectPathMutation);

    const shouldRedirectTo = useCallback(() => {
      if (!data || (data.viewer && data.viewer.email)) {
        return false;
      }
      return true;
    }, [data]);

    const hasAccess = useCallback(() => {
      const { viewer } = data || null;
      if (viewer) {
        if (
          (check.role && !roleIsAtLeast(viewer.role, check.role)) ||
          (check.ability && !canInGeneral(viewer, check.ability))
        ) {
          return false;
        }
        return true;
      }
      return false;
    }, [data]);

    const redirectIfNotLoggedIn = useCallback(async () => {
      if (!shouldRedirectTo()) {
        return;
      }
      // If I was previously logged in then logged out, we don't need to set the redirect path.
      if (!wasLoggedIn) {
        const location = match.location;
        await setRedirectPathMutation({
          path: location.pathname + location.search + location.hash,
        });
      }
      router.replace("/admin/login");
    }, [
      router,
      match.location,
      setRedirectPathMutation,
      shouldRedirectTo,
      wasLoggedIn,
    ]);

    useEffect(() => {
      void redirectIfNotLoggedIn();
    }, []);

    useEffect(() => {
      if (data && data.viewer) {
        setWasLoggedIn(true);
      }
      void redirectIfNotLoggedIn();
      if (data && !data.viewer) {
        setWasLoggedIn(false);
      }
    }, [data, redirectIfNotLoggedIn]);

    if (error) {
      return <NetworkError />;
    }

    if (!data || shouldRedirectTo()) {
      return null;
    }

    if (hasAccess()) {
      return <>{children}</>;
    }

    return <RestrictedContainer viewer={data.viewer} />;
  };

  const enhanced = withRouteConfig<Props>({
    query: graphql`
      query AuthCheckRouteQuery {
        viewer {
          ...RestrictedContainer_viewer
          id
          username
          email
          profiles {
            __typename
          }
          role
        }
        settings {
          auth {
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
        }
      }
    `,
  })(AuthCheckRoute);

  return enhanced;
}

export default createAuthCheckRoute;
