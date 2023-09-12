import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Label } from "coral-ui/components/v2";

import { SSOSigningSecretStatus } from "./StatusField";

import styles from "./DateField.css";

export interface SSOSigningSecretDates {
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
  readonly rotatedAt: string | null;
  readonly inactiveAt: string | null;
}

interface Props {
  status: SSOSigningSecretStatus;
  dates: SSOSigningSecretDates;
}

const DateField: FunctionComponent<Props> = ({ status, dates }) => {
  switch (status) {
    case SSOSigningSecretStatus.ACTIVE:
      return (
        <>
          <div className={styles.label}>
            <Localized id="configure-auth-sso-rotate-activeSince">
              <Label>Active Since</Label>
            </Localized>
          </div>
          <Localized
            id="configure-auth-sso-rotate-date"
            vars={{ date: new Date(dates.createdAt) }}
          >
            <span className={styles.date}>{dates.createdAt}</span>
          </Localized>
        </>
      );
    case SSOSigningSecretStatus.EXPIRING:
      return (
        <>
          <div className={styles.label}>
            <Localized id="configure-auth-sso-rotate-inactiveAt">
              <Label>Inactive At</Label>
            </Localized>
          </div>
          <Flex
            alignItems="center"
            justifyContent="center"
            className={styles.date}
          >
            <Localized
              id="configure-auth-sso-rotate-date"
              vars={{
                date: dates.inactiveAt
                  ? new Date(dates.inactiveAt)
                  : new Date(dates.createdAt),
              }}
            >
              {dates.inactiveAt}
            </Localized>
          </Flex>
        </>
      );
    case SSOSigningSecretStatus.EXPIRED:
      return (
        <>
          <div className={styles.label}>
            <Localized id="configure-auth-sso-rotate-inactiveSince">
              <Label>Inactive Since</Label>
            </Localized>
          </div>
          <Flex
            alignItems="center"
            justifyContent="center"
            className={styles.date}
          >
            <Localized
              id="configure-auth-sso-rotate-date"
              vars={{
                date: dates.inactiveAt
                  ? new Date(dates.inactiveAt)
                  : new Date(dates.createdAt),
              }}
            >
              {dates.inactiveAt}
            </Localized>
          </Flex>
        </>
      );
    default:
      return null;
  }
};

export default DateField;
