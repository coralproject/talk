import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { FormField, Label, PasswordField } from "coral-admin/ui/components";
import { Button, Flex, Icon } from "coral-ui/components";

import HelperText from "../../HelperText";
import styles from "./SSOKeyField.css";

interface Props {
  disabled?: boolean;
  generatedKey?: string;
  keyGeneratedAt?: any;
  onRegenerate?: () => void;
}

const SSOKeyField: FunctionComponent<Props> = ({
  generatedKey,
  keyGeneratedAt,
  disabled,
  onRegenerate,
}) => (
  <FormField className={styles.root} data-testid="configure-auth-sso-key">
    <Localized id="configure-auth-sso-key">
      <Label>Key</Label>
    </Localized>
    <PasswordField
      name="key"
      value={generatedKey}
      readOnly
      // TODO: (wyattjoh) figure out how to add translations to these props
      hidePasswordTitle="Show SSO Key"
      showPasswordTitle="Hide SSO Key"
      fullWidth
    />
    <Localized id="configure-auth-sso-regenerateAt" $date={keyGeneratedAt}>
      <HelperText className={styles.keyGenerated}>
        KEY GENERATED AT: {keyGeneratedAt}
      </HelperText>
    </Localized>
    <div className={styles.warningSection}>
      <Flex direction="row" itemGutter="half">
        <Icon className={styles.warnIcon}>warning</Icon>
        <Localized id="configure-auth-sso-regenerateWarning">
          <HelperText>
            Regenerating a key will invalidate any existing user sessions, and
            all signed-in users will be signed out
          </HelperText>
        </Localized>
      </Flex>
    </div>

    <Localized id="configure-auth-sso-regenerate">
      <Button
        id="configure-auth-sso-regenerate"
        variant="filled"
        color="primary"
        size="small"
        disabled={disabled}
        onClick={onRegenerate}
        className={styles.regenerateButton}
      >
        Regenerate
      </Button>
    </Localized>
  </FormField>
);

export default SSOKeyField;
