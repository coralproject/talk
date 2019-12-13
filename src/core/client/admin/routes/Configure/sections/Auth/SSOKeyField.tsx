import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import {
  Button,
  Flex,
  FormField,
  Icon,
  Label,
  PasswordField,
} from "coral-ui/components/v2";

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
  <FormField className={styles.root}>
    <Localized id="configure-auth-sso-key">
      <Label htmlFor="configure-auth-sso-key">Key</Label>
    </Localized>
    <PasswordField
      id="configure-auth-sso-key"
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
        <Localized id="configure-auth-sso-regenerateHonoredWarning">
          <HelperText>
            When regenerating a key, tokens signed with the previous key will be
            honored for 30 days.
          </HelperText>
        </Localized>
      </Flex>
    </div>

    <Localized id="configure-auth-sso-regenerate">
      <Button
        id="configure-auth-sso-regenerate"
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
