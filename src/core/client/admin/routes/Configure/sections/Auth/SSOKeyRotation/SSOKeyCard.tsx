import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { CopyButton } from "coral-framework/components";
import {
  Button,
  Card,
  Flex,
  HorizontalGutter,
  Icon,
  Label,
  PasswordField,
  TextField,
} from "coral-ui/components/v2";

import styles from "./SSOKeyCard.css";

export enum SSOKeyStatus {
  EXPIRED,
  EXPIRING,
  ACTIVE,
}

export interface SSOKeyDates {
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
  readonly rotatedAt: string | null;
  readonly inactiveAt: string | null;
}

interface Props {
  id: string;
  secret: string;
  status: SSOKeyStatus;
  dates: SSOKeyDates;
}

function getStatusField(status: SSOKeyStatus) {
  if (status === SSOKeyStatus.ACTIVE) {
    return (
      <Localized id="configure-auth-sso-rotate-statusActive">
        <span className={cn(styles.status, styles.active)}>Active</span>
      </Localized>
    );
  }
  if (status === SSOKeyStatus.EXPIRING) {
    return (
      <Localized id="configure-auth-sso-rotate-statusExpiring">
        <span className={cn(styles.status)}>Expiring</span>
      </Localized>
    );
  }
  if (status === SSOKeyStatus.EXPIRED) {
    return (
      <Localized id="configure-auth-sso-rotate-statusExpired">
        <span className={cn(styles.status)}>Expired</span>
      </Localized>
    );
  }

  return (
    <Localized id="configure-auth-sso-rotate-statusUnknown">
      <span>Unknown</span>
    </Localized>
  );
}

function getDateField(dates: SSOKeyDates) {
  // Active
  if (dates.createdAt && !dates.rotatedAt && !dates.inactiveAt) {
    return (
      <>
        <div className={styles.label}>
          <Localized id="configure-auth-sso-rotate-activeSince">
            <Label>Active Since</Label>
          </Localized>
        </div>
        <Localized
          id="configure-auth-sso-rotate-date"
          $date={new Date(dates.createdAt)}
        >
          <span className={styles.date}>{dates.createdAt}</span>
        </Localized>
      </>
    );
  }

  // Expired
  if (dates.inactiveAt) {
    return (
      <>
        <div className={styles.label}>
          <Localized id="configure-auth-sso-rotate-inactiveSince">
            <Label>Inactive Since</Label>
          </Localized>
        </div>
        <Localized
          id="configure-auth-sso-rotate-date"
          $date={new Date(dates.inactiveAt)}
        >
          <span className={styles.date}>{dates.inactiveAt}</span>
        </Localized>
      </>
    );
  }

  // Expiring
  if (dates.rotatedAt && !dates.inactiveAt) {
    return (
      <>
        <div className={styles.label}>
          <Localized id="configure-auth-sso-rotate-inactiveAt">
            <Label>Inactive At</Label>
          </Localized>
        </div>
        <Localized
          id="configure-auth-sso-rotate-date"
          $date={new Date(dates.rotatedAt)}
        >
          <span className={styles.date}>{dates.rotatedAt}</span>
        </Localized>
      </>
    );
  }

  return null;
}

function getActionButton(status: SSOKeyStatus) {
  if (status === SSOKeyStatus.ACTIVE) {
    return <Button>Rotate</Button>;
  }
  if (status === SSOKeyStatus.EXPIRING) {
    return <Button>Deactivate Now</Button>;
  }
  if (status === SSOKeyStatus.EXPIRED) {
    return <Button>Delete</Button>;
  }

  return null;
}

const SSOKeyCard: FunctionComponent<Props> = ({
  id,
  secret,
  status,
  dates,
}) => {
  return (
    <Card>
      <HorizontalGutter>
        <Flex alignItems="center" justifyContent="space-between">
          <div className={styles.keySection}>
            <div className={styles.label}>
              <Localized id="configure-auth-sso-rotate-keyID">
                <Label>Key ID</Label>
              </Localized>
            </div>
            <TextField value={id} readOnly fullWidth />
          </div>
          <div className={styles.secretSection}>
            <div className={styles.label}>
              <Localized id="configure-auth-sso-rotate-secret">
                <Label>Secret</Label>
              </Localized>
            </div>
            <Flex alignItems="center" justifyContent="flex-start">
              <PasswordField
                id="configure-auth-sso-rotate-secretField"
                name="key"
                value={secret}
                readOnly
                // TODO: (nick-funk) figure out how to add translations to these props
                hidePasswordTitle="Show Secret"
                showPasswordTitle="Hide Secret"
                fullWidth
              />
              <Localized id="configure-auth-sso-rotate-copySecret">
                <CopyButton text={secret}>
                  <Icon>copy</Icon>
                </CopyButton>
              </Localized>
            </Flex>
          </div>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" justifyContent="flex-start">
            <div className={styles.statusSection}>
              <div className={styles.label}>
                <Localized id="configure-auth-sso-rotate-status">
                  <Label>Status</Label>
                </Localized>
              </div>
              {getStatusField(status)}
            </div>
            <div>{getDateField(dates)}</div>
          </Flex>
          {getActionButton(status)}
        </Flex>
      </HorizontalGutter>
    </Card>
  );
};

export default SSOKeyCard;
