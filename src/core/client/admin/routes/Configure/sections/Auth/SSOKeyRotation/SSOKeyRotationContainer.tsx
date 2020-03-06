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

function sortByDate(items: Key[]) {
  return items.sort((a: Key, b: Key) => {
    const aDate = new Date(a.createdAt);
    const bDate = new Date(b.createdAt);

    return bDate.getTime() - aDate.getTime();
  });
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
      {sortByDate(
        keys.map(k => {
          return {
            kid: k.kid,
            secret: k.secret,
            createdAt: k.createdAt,
            lastUsedAt: k.lastUsedAt,
            rotatedAt: k.rotatedAt,
            inactiveAt: k.inactiveAt,
          };
        })
      ).map(key => {
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
