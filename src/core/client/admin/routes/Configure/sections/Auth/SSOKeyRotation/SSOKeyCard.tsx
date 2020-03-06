import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  Card,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Flex,
  HorizontalGutter,
  Icon,
  Label,
  PasswordField,
  Popover,
  TextField,
} from "coral-ui/components/v2";

import RotateSSOKeyMutation from "./RotateSSOKey";

import styles from "./SSOKeyCard.css";

export enum SSOKeyStatus {
  EXPIRED,
  EXPIRING,
  ACTIVE,
}

export enum RotateOptions {
  NOW = "NOW",
  IN10SECONDS = "IN10SECONDS",
  IN1DAY = "IN1DAY",
  IN1WEEK = "IN1WEEK",
  IN30DAYS = "IN30DAYS",
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
      <Flex
        alignItems="center"
        justifyContent="center"
        className={cn(styles.status, styles.expiring)}
      >
        <Icon className={styles.icon}>alarm</Icon>
        <Localized id="configure-auth-sso-rotate-statusExpiring">
          <span>Expiring</span>
        </Localized>
      </Flex>
    );
  }
  if (status === SSOKeyStatus.EXPIRED) {
    return (
      <Localized id="configure-auth-sso-rotate-statusExpired">
        <span className={cn(styles.status, styles.expired)}>Expired</span>
      </Localized>
    );
  }

  return (
    <Localized id="configure-auth-sso-rotate-statusUnknown">
      <span>Unknown</span>
    </Localized>
  );
}

function getDateField(status: SSOKeyStatus, dates: SSOKeyDates) {
  // Active
  if (status === SSOKeyStatus.ACTIVE) {
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

  // Expiring
  if (status === SSOKeyStatus.EXPIRING) {
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
            $date={
              dates.inactiveAt
                ? new Date(dates.inactiveAt)
                : new Date(dates.createdAt)
            }
          >
            {dates.inactiveAt}
          </Localized>
        </Flex>
      </>
    );
  }

  // Expired
  if (status === SSOKeyStatus.EXPIRED) {
    return (
      <>
        <div className={styles.label}>
          <Localized id="configure-auth-sso-rotate-inactiveSince">
            <Label>Inactive Since</Label>
          </Localized>
        </div>
        <Localized
          id="configure-auth-sso-rotate-date"
          $date={
            dates.inactiveAt
              ? new Date(dates.inactiveAt)
              : new Date(dates.createdAt)
          }
        >
          <span className={styles.date}>{dates.inactiveAt}</span>
        </Localized>
      </>
    );
  }

  return null;
}

function getTranslation(r: string) {
  switch (r) {
    case RotateOptions.NOW: {
      return <Localized id="configure-auth-sso-rotate-now">Now</Localized>;
    }
    case RotateOptions.IN10SECONDS: {
      return (
        <Localized id="configure-auth-sso-rotate-10seconds">
          10 seconds from now
        </Localized>
      );
    }
    case RotateOptions.IN1DAY: {
      return (
        <Localized id="configure-auth-sso-rotate-1day">
          1 day from now
        </Localized>
      );
    }
    case RotateOptions.IN1WEEK: {
      return (
        <Localized id="configure-auth-sso-rotate-1week">
          1 week from now
        </Localized>
      );
    }
    case RotateOptions.IN30DAYS: {
      return (
        <Localized id="configure-auth-sso-rotate-30days">
          30 days from now
        </Localized>
      );
    }
    default:
      return <Localized id="configure-auth-sso-rotate-now">Now</Localized>;
  }
}

function getActionButton(
  status: SSOKeyStatus,
  onChangeStatus: (rotation: string) => void
) {
  if (status === SSOKeyStatus.ACTIVE) {
    return (
      <Localized
        id="configure-auth-sso-rotate-dropdown-description"
        attrs={{ description: true }}
      >
        <Popover
          id="sso-key-rotate"
          placement="bottom-start"
          description="A dropdown to rotate the SSO key"
          body={({ toggleVisibility }) => (
            <ClickOutside onClickOutside={toggleVisibility}>
              <Dropdown>
                {Object.keys(RotateOptions).map((r: string) => (
                  <DropdownButton
                    key={r}
                    onClick={() => {
                      onChangeStatus(r);
                      toggleVisibility();
                    }}
                  >
                    {getTranslation(r)}
                  </DropdownButton>
                ))}
              </Dropdown>
            </ClickOutside>
          )}
        >
          {({ toggleVisibility, ref, visible }) => (
            <Button onClick={toggleVisibility} ref={ref} color="regular">
              <Localized id="configure-auth-sso-rotate-rotate">
                <span className={styles.action}>Rotate</span>
              </Localized>
              <Icon>arrow_drop_down</Icon>
            </Button>
          )}
        </Popover>
      </Localized>
    );
  }
  if (status === SSOKeyStatus.EXPIRING) {
    return (
      <Localized id="configure-auth-sso-rotate-deactivateNow">
        <Button color="alert">Deactivate Now</Button>
      </Localized>
    );
  }
  if (status === SSOKeyStatus.EXPIRED) {
    return (
      <Localized id="configure-auth-sso-rotate-delete">
        <Button color="alert">Delete</Button>
      </Localized>
    );
  }

  return null;
}

const SSOKeyCard: FunctionComponent<Props> = ({
  id,
  secret,
  status,
  dates,
}) => {
  const rotateSSOKey = useMutation(RotateSSOKeyMutation);
  const onRotate = useCallback((rotation: string) => {
    window.console.log(rotation);
    switch (rotation) {
      case RotateOptions.NOW:
        rotateSSOKey({ inactiveIn: 0 });
        break;
      case RotateOptions.IN10SECONDS:
        rotateSSOKey({ inactiveIn: 10 });
        break;
      case RotateOptions.IN1DAY:
        rotateSSOKey({ inactiveIn: 24 * 60 * 60 });
        break;
      case RotateOptions.IN1WEEK:
        rotateSSOKey({ inactiveIn: 7 * 24 * 60 * 60 });
        break;
      case RotateOptions.IN30DAYS:
        rotateSSOKey({ inactiveIn: 30 * 24 * 60 * 60 });
        break;
      default:
        rotateSSOKey({ inactiveIn: 0 });
    }
  }, []);

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
              <CopyToClipboard text={secret}>
                <Localized
                  id="configure-auth-sso-rotate-copySecret"
                  attrs={{ "aria-label": true }}
                >
                  <Button color="mono" variant="flat" aria-label="Copy Secret">
                    <Icon size="md">content_copy</Icon>
                  </Button>
                </Localized>
              </CopyToClipboard>
            </Flex>
          </div>
        </Flex>
        <Flex alignItems="flex-end" justifyContent="space-between">
          <Flex alignItems="center" justifyContent="flex-start">
            <div className={styles.statusSection}>
              <div className={styles.label}>
                <Localized id="configure-auth-sso-rotate-status">
                  <Label>Status</Label>
                </Localized>
              </div>
              {getStatusField(status)}
            </div>
            <div>{getDateField(status, dates)}</div>
          </Flex>
          {getActionButton(status, onRotate)}
        </Flex>
      </HorizontalGutter>
    </Card>
  );
};

export default SSOKeyCard;
