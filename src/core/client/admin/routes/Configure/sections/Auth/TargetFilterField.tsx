import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";
import { CheckBox, Flex, FormField, Label } from "coral-ui/components/v2";

interface Props {
  label: React.ReactNode;
  name: string;
  disabled: boolean;
}

const TargetFilterField: FunctionComponent<Props> = ({
  name,
  label,
  disabled,
}) => (
  <FormField>
    <Label>{label}</Label>
    <Flex direction="row" itemGutter="double">
      <Field name={`${name}.admin`} type="checkbox" parse={parseBool}>
        {({ input }) => (
          <Localized id="configure-auth-targetFilterCoralAdmin">
            <CheckBox id={input.name} disabled={disabled} {...input}>
              Coral Admin
            </CheckBox>
          </Localized>
        )}
      </Field>
      <Field name={`${name}.stream`} type="checkbox" parse={parseBool}>
        {({ input }) => (
          <Localized id="configure-auth-targetFilterCommentStream">
            <CheckBox id={input.name} disabled={disabled} {...input}>
              Comment Stream
            </CheckBox>
          </Localized>
        )}
      </Field>
    </Flex>
  </FormField>
);

export default TargetFilterField;
