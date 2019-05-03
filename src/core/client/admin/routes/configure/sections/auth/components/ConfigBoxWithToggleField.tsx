import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { parseBool } from "talk-framework/lib/form";

import { CheckBox, FormField } from "talk-ui/components";

import ConfigBox from "../../../components/ConfigBox";

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
              <CheckBox
                id={input.name}
                name={input.name}
                onChange={input.onChange}
                checked={input.value}
                disabled={disabled}
                light
              >
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
