import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import {
  Button,
  Flex,
  FormField,
  Icon,
  InputLabel,
  TextField,
  Typography,
} from "talk-ui/components";

import styles from "./SSOKeyField.css";

interface Props {
  disabled?: boolean;
  generatedKey?: string;
  keyGeneratedAt?: any;
  onRegenerate?: () => void;
}

const SSOKeyField: StatelessComponent<Props> = ({
  generatedKey,
  keyGeneratedAt,
  disabled,
  onRegenerate,
}) => (
  <FormField data-testid="configure-auth-sso-key">
    <Localized id="configure-auth-sso-key">
      <InputLabel>Key</InputLabel>
    </Localized>
    <Flex direction="row" itemGutter="half" alignItems="center">
      <TextField name="key" value={generatedKey} readOnly />
      <Localized id="configure-auth-sso-regenerate">
        <Button
          id="configure-auth-sso-regenerate"
          variant="filled"
          color="primary"
          size="small"
          disabled={disabled}
          onClick={onRegenerate}
        >
          Regenerate
        </Button>
      </Localized>
    </Flex>
    <Flex direction="row" itemGutter="half">
      <Localized id="configure-auth-sso-regenerateAt" $date={keyGeneratedAt}>
        <Typography className={styles.keyGenerated}>
          KEY GENERATED AT: {keyGeneratedAt}
        </Typography>
      </Localized>
      <Icon className={styles.warnIcon}>warning</Icon>
      <Localized id="configure-auth-sso-regenerateWarning">
        <Typography className={styles.warn} variant="bodyCopy">
          Regenerating a key will invalidate any existing user sessions, and all
          signed-in users will be signed out
        </Typography>
      </Localized>
    </Flex>
  </FormField>
);

export default SSOKeyField;
