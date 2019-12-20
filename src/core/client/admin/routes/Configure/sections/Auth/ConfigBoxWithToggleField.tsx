import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";
import { CheckBox, FormField } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";

interface Props {
  id?: string;
  name: string;
  title: React.ReactNode;
  disabled?: boolean;
  children: (disabledInside: boolean) => React.ReactNode;
}

const ConfigBoxWithToggleField: FunctionComponent<Props> = ({
  id,
  name,
  title,
  disabled,
  children,
  ...rest
}) => (
  <Field name={name} type="checkbox" parse={parseBool}>
    {({ input }) => (
      <ConfigBox
        {...rest}
        id={id}
        title={title}
        topRight={
          <FormField>
            <Localized id="configure-auth-configBoxEnabled">
              <CheckBox {...input} id={input.name} disabled={disabled} light>
                Enabled
              </CheckBox>
            </Localized>
          </FormField>
        }
      >
        {children(disabled || !input.value)}
      </ConfigBox>
    )}
  </Field>
);

export default ConfigBoxWithToggleField;
