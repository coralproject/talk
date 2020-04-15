import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Label } from "coral-ui/components/v2";

import { SSOKeyRotationContainer_settings } from "coral-admin/__generated__/SSOKeyRotationContainer_settings.graphql";

import SSOKeyCard, { SSOKeyDates } from "./SSOKeyCard";
import { SSOKeyStatus } from "./StatusField";

interface Props {
  settings: SSOKeyRotationContainer_settings;
  disabled?: boolean;
}

interface Key {
  readonly kid: string;
  readonly secret: string;
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
  readonly rotatedAt: string | null;
  readonly inactiveAt: string | null;
}

function getStatus(dates: SSOKeyDates) {
  if (
    dates.inactiveAt &&
    dates.rotatedAt &&
    new Date(dates.inactiveAt) > new Date()
  ) {
    return SSOKeyStatus.EXPIRING;
  }

  if (dates.inactiveAt && new Date(dates.inactiveAt) <= new Date()) {
    return SSOKeyStatus.EXPIRED;
  }

  return SSOKeyStatus.ACTIVE;
}

const SSOKeyRotationContainer: FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  const {
    auth: {
      integrations: {
        sso: { keys },
      },
    },
  } = settings;

  const sortedKeys = useMemo(
    () =>
      keys
        // Copy this map because we don't want to modify the underlying copy.
        .map((key) => key)
        .sort((a: Key, b: Key) => {
          // Both active, sort on createdAt date.
          if (!a.inactiveAt && !b.inactiveAt) {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }
          // A is active, B is not, A comes before B.
          if (!a.inactiveAt && b.inactiveAt) {
            return -1;
          }
          // B is active, A is not, B comes before A.
          if (a.inactiveAt && !b.inactiveAt) {
            return 1;
          }

          // Sort primarily on inactiveAt, fall back to createdAt if
          // for some reason it's not available.
          const aDate = a.inactiveAt
            ? new Date(a.inactiveAt)
            : new Date(a.createdAt);
          const bDate = b.inactiveAt
            ? new Date(b.inactiveAt)
            : new Date(b.createdAt);

          return bDate.getTime() - aDate.getTime();
        }),
    [keys]
  );

  return (
    <>
      <Localized id="configure-auth-sso-rotate-keys">
        <Label htmlFor="configure-auth-sso-rotate-keys">Keys</Label>
      </Localized>
      {sortedKeys.map((key) => (
        <SSOKeyCard
          key={key.kid}
          id={key.kid}
          secret={key.secret}
          status={getStatus(key)}
          dates={key}
          disabled={disabled}
        />
      ))}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment SSOKeyRotationContainer_settings on Settings {
      auth {
        integrations {
          sso {
            enabled
            keys {
              kid
              secret
              createdAt
              lastUsedAt
              rotatedAt
              inactiveAt
            }
          }
        }
      }
    }
  `,
})(SSOKeyRotationContainer);

export default enhanced;
