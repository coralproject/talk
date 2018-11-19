import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { CheckBox, FormField } from "talk-ui/components";

import ConfigBox from "../../../components/ConfigBox";

interface Props {
  id?: string;
  name: string;
  title: React.ReactNode;
  disabled?: boolean;
  children: (disabledInside: boolean) => React.ReactNode;
}

const bool = (v: any) => !!v;

const ConfigBoxWithToggleField: StatelessComponent<Props> = ({
  id,
  name,
  title,
  disabled,
  children,
}) => (
  <Field name={name} type="checkbox" parse={bool}>
    {({ input }) => (
      <ConfigBox
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
