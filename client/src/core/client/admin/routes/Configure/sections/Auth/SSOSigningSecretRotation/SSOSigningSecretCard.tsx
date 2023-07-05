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
import DeactivateSSOSigningSecretMutation from "./DeactivateSSOSigningSecretMutation";
import DeleteSSOSigningSecretMutation from "./DeleteSSOSigningSecretMutation";
import RotateSSOSigningSecretMutation from "./RotateSSOSigningSecretMutation";
import RotationDropDown from "./RotationDropdown";
import { RotateOptions } from "./RotationOption";
import StatusField, { SSOSigningSecretStatus } from "./StatusField";

import styles from "./SSOSigningSecretCard.css";

export interface SSOSigningSecretDates {
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
  readonly rotatedAt: string | null;
  readonly inactiveAt: string | null;
}

interface Props {
  id: string;
  secret: string;
  status: SSOSigningSecretStatus;
  dates: SSOSigningSecretDates;
  disabled?: boolean;
}

function createActionButton(
  status: SSOSigningSecretStatus,
  onRotateKey: (rotation: string) => void,
  onDeactivateKey: () => void,
  onDelete: () => void,
  disabled?: boolean
) {
  switch (status) {
    case SSOSigningSecretStatus.ACTIVE:
      return <RotationDropDown onRotateKey={onRotateKey} disabled={disabled} />;
    case SSOSigningSecretStatus.EXPIRING:
      return (
        <Localized id="configure-auth-sso-rotate-deactivateNow">
          <Button color="alert" onClick={onDeactivateKey} disabled={disabled}>
            Deactivate Now
          </Button>
        </Localized>
      );
    case SSOSigningSecretStatus.EXPIRED:
      return (
        <Localized id="configure-auth-sso-rotate-delete">
          <Button color="alert" onClick={onDelete} disabled={disabled}>
            Delete
          </Button>
        </Localized>
      );
    default:
      return null;
  }
}

const SSOSigningSecretCard: FunctionComponent<Props> = ({
  id,
  secret,
  status,
  dates,
  disabled,
}) => {
  const rotateSSOSigningSecret = useMutation(RotateSSOSigningSecretMutation);
  const deactivateSSOSigningSecret = useMutation(
    DeactivateSSOSigningSecretMutation
  );
  const deleteSSOSigningSecret = useMutation(DeleteSSOSigningSecretMutation);

  const onRotate = useCallback(
    (rotation: string) => {
      switch (rotation) {
        case RotateOptions.NOW:
          void rotateSSOSigningSecret({ inactiveIn: 0 });
          break;
        case RotateOptions.IN1DAY:
          void rotateSSOSigningSecret({ inactiveIn: 24 * 60 * 60 });
          break;
        case RotateOptions.IN1WEEK:
          void rotateSSOSigningSecret({ inactiveIn: 7 * 24 * 60 * 60 });
          break;
        case RotateOptions.IN30DAYS:
          void rotateSSOSigningSecret({ inactiveIn: 30 * 24 * 60 * 60 });
          break;
        default:
          void rotateSSOSigningSecret({ inactiveIn: 0 });
      }
    },
    [rotateSSOSigningSecret]
  );
  const onDeactivate = useCallback(() => {
    void deactivateSSOSigningSecret({
      kid: id,
    });
  }, [deactivateSSOSigningSecret, id]);
  const onDelete = useCallback(() => {
    void deleteSSOSigningSecret({
      kid: id,
    });
  }, [deleteSSOSigningSecret, id]);

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
          {createActionButton(
            status,
            onRotate,
            onDeactivate,
            onDelete,
            disabled
          )}
        </Flex>
      </HorizontalGutter>
    </Card>
  );
};

export default SSOSigningSecretCard;
