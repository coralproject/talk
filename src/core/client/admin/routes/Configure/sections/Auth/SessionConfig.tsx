import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql, useFragment } from "react-relay";

import { colorFromMeta, parseInteger } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
} from "coral-framework/lib/validation";
import {
  DurationField,
  FieldSet,
  FormField,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

import { SessionConfig_auth$key } from "coral-admin/__generated__/SessionConfig_auth.graphql";

interface Props {
  auth: SessionConfig_auth$key;
  disabled?: boolean;
}

const SessionConfig: FunctionComponent<Props> = ({ auth, disabled }) => {
  useFragment(
    graphql`
      fragment SessionConfig_auth on Auth {
        sessionDuration
      }
    `,
    auth
  );

  return (
    <ConfigBox
      title={
        <Localized id="configure-auth-settings">
          <Header container="h2">Session settings</Header>
        </Localized>
      }
    >
      <FormField container={<FieldSet />}>
        <Localized id="configure-auth-settings-session-duration-label">
          <Label component="legend">Session Duration</Label>
        </Localized>
        <Field
          name="auth.sessionDuration"
          validate={composeValidators(
            required,
            validateWholeNumberGreaterThanOrEqual(0)
          )}
          parse={parseInteger}
        >
          {({ input, meta }) => (
            <>
              <DurationField
                {...input}
                color={colorFromMeta(meta)}
                disabled={!!disabled}
              />
              <ValidationMessage meta={meta} fullWidth />
            </>
          )}
        </Field>
      </FormField>
    </ConfigBox>
  );
};

export default SessionConfig;
