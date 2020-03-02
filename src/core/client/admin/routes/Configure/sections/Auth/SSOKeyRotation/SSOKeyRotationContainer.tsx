import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Label } from "coral-ui/components/v2";

import { SSOKeyRotationContainer_settings } from "coral-admin/__generated__/SSOKeyRotationContainer_settings.graphql";

import SSOKeyCard, { SSOKeyDates, SSOKeyStatus } from "./SSOKeyCard";

interface Props {
  settings: SSOKeyRotationContainer_settings;
  disabled?: boolean;
}

function getStatus(dates: SSOKeyDates) {
  if (dates.inactiveAt) {
    return SSOKeyStatus.EXPIRED;
  }
  if (
    dates.lastUsedAt &&
    dates.rotatedAt &&
    new Date(dates.lastUsedAt) < new Date(dates.rotatedAt)
  ) {
    return SSOKeyStatus.EXPIRING;
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

  return (
    <>
      <Localized id="configure-auth-sso-rotate-keys">
        <Label htmlFor="configure-auth-sso-rotate-keys">Keys</Label>
      </Localized>
      {keys.map(key => {
        return (
          <SSOKeyCard
            key={key.kid}
            id={key.kid}
            secret={key.secret}
            status={getStatus(key)}
            dates={key}
          />
        );
      })}
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
