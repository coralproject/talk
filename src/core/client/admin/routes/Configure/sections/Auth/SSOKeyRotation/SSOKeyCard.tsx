import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { useMutation } from "coral-framework/lib/relay";
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

import DateField from "./DateField";
import DeactivateSSOKeyMutation from "./DeactivateSSOKeyMutation";
import DeleteSSOKeyMutation from "./DeleteSSOKeyMutation";
import RotateSSOKeyMutation from "./RotateSSOKeyMutation";
import RotationDropDown from "./RotationDropdown";
import { RotateOptions } from "./RotationOption";
import StatusField, { SSOKeyStatus } from "./StatusField";

import styles from "./SSOKeyCard.css";

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

function createActionButton(
  status: SSOKeyStatus,
  onRotateKey: (rotation: string) => void,
  onDeactivateKey: () => void,
  onDelete: () => void
) {
  if (status === SSOKeyStatus.ACTIVE) {
    return <RotationDropDown onRotateKey={onRotateKey} />;
  }
  if (status === SSOKeyStatus.EXPIRING) {
    return (
      <Localized id="configure-auth-sso-rotate-deactivateNow">
        <Button color="alert" onClick={onDeactivateKey}>
          Deactivate Now
        </Button>
      </Localized>
    );
  }
  if (status === SSOKeyStatus.EXPIRED) {
    return (
      <Localized id="configure-auth-sso-rotate-delete">
        <Button color="alert" onClick={onDelete}>
          Delete
        </Button>
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
  const deactivateSSOKey = useMutation(DeactivateSSOKeyMutation);
  const deleteSSOKey = useMutation(DeleteSSOKeyMutation);

  const onRotate = useCallback(
    (rotation: string) => {
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
    },
    [rotateSSOKey]
  );
  const onDeactivate = useCallback(() => {
    deactivateSSOKey({
      kid: id,
    });
  }, [deactivateSSOKey, id]);
  const onDelete = useCallback(() => {
    deleteSSOKey({
      kid: id,
    });
  }, [deleteSSOKey, id]);

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
            <TextField value={id} readOnly fullWidth data-testid="SSO-Key-ID" />
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
                <Button color="mono" variant="flat">
                  <Localized
                    id="configure-auth-sso-rotate-copySecret"
                    attrs={{ "aria-label": true }}
                  >
                    <Icon size="md" aria-label="Copy Secret">
                      content_copy
                    </Icon>
                  </Localized>
                </Button>
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
              <StatusField status={status}></StatusField>
            </div>
            <div>
              <DateField status={status} dates={dates} />
            </div>
          </Flex>
          {createActionButton(status, onRotate, onDeactivate, onDelete)}
        </Flex>
      </HorizontalGutter>
    </Card>
  );
};

export default SSOKeyCard;
