import { useRouter } from "found";
import React, { FunctionComponent, useEffect, useState } from "react";
import { graphql } from "react-relay";

import { SetRedirectPathMutation } from "coral-admin/mutations";
import { AbilityType, can } from "coral-admin/permissions";
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
}

type CheckParams =
  | {
      role: GQLUSER_ROLE;
      ability?: AbilityType;
    }
  | {
      role?: GQLUSER_ROLE;
      ability: AbilityType;
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
    }, [data]);

    function shouldRedirectTo() {
      if (!data || (data.viewer && data.viewer.email)) {
        return false;
      }
      return true;
    }

    function hasAccess() {
      const { viewer } = data;
      if (viewer) {
        if (
          (check.role && !roleIsAtLeast(viewer.role, check.role)) ||
          (check.ability && !can(viewer, check.ability))
        ) {
          return false;
        }
        return true;
      }
      return false;
    }

    async function redirectIfNotLoggedIn() {
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
    }

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
