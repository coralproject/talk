import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Label } from "coral-ui/components/v2";

import { SSOSigningSecretRotationContainer_settings } from "coral-admin/__generated__/SSOSigningSecretRotationContainer_settings.graphql";

import SSOSigningSecretCard, {
  SSOSigningSecretDates,
} from "./SSOSigningSecretCard";
import { SSOSigningSecretStatus } from "./StatusField";

interface Props {
  settings: SSOSigningSecretRotationContainer_settings;
  disabled?: boolean;
}

function getStatus(dates: SSOSigningSecretDates) {
  if (
    dates.inactiveAt &&
    dates.rotatedAt &&
    new Date(dates.inactiveAt) > new Date()
  ) {
    return SSOSigningSecretStatus.EXPIRING;
  }

  if (dates.inactiveAt && new Date(dates.inactiveAt) <= new Date()) {
    return SSOSigningSecretStatus.EXPIRED;
  }

  return SSOSigningSecretStatus.ACTIVE;
}

const SSOSigningSecretRotationContainer: FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  const {
    auth: {
      integrations: {
        sso: { signingSecrets },
      },
    },
  } = settings;

  const sortedSigningSecrets = useMemo(
    () =>
      signingSecrets
        // Copy this map because we don't want to modify the underlying copy.
        .map((key) => key)
        .sort((a, b) => {
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
    [signingSecrets]
  );

  return (
    <>
      <Localized id="configure-auth-sso-rotate-keys">
        <Label htmlFor="configure-auth-sso-rotate-keys">Keys</Label>
      </Localized>
      {sortedSigningSecrets.map((key) => (
        <SSOSigningSecretCard
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
    fragment SSOSigningSecretRotationContainer_settings on Settings {
      auth {
        integrations {
          sso {
            enabled
            signingSecrets {
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
})(SSOSigningSecretRotationContainer);

export default enhanced;
