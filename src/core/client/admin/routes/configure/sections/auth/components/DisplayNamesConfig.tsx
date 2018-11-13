import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import {
  Flex,
  FormField,
  HorizontalGutter,
  RadioButton,
  Typography,
} from "talk-ui/components";

import Header from "../../../components/Header";

interface Props {
  disabled?: boolean;
}

const parseStringBool = (v: string) => v === "true";

const DisplayNamesConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-auth-displayNamesConfig-title">
      <Header>Display Names</Header>
    </Localized>
    <Localized id="configure-auth-displayNamesConfig-explanationShort">
      <Typography>
        Some AUTH integrations include a Display Name as well as a User Name.
      </Typography>
    </Localized>
    <Localized id="configure-auth-displayNamesConfig-explanationLong">
      <Typography>
        A User Name has to be unique (there can only be one Juan_Doe, for
        example), whereas a Display Name does not. If your AUTH provider allows
        for Display Names, you can enable this option. This allows for fewer
        strange names (Juan_Doe23245) – however it could also be used to
        spoof/impersonate another user.
      </Typography>
    </Localized>

    <FormField>
      <Flex direction="row" itemGutter="double">
        <Field
          name={"auth.displayName.enabled"}
          type="radio"
          parse={parseStringBool}
          value
        >
          {({ input }) => (
            <Localized id="configure-auth-displayNamesConfig-showDisplayNames">
              <RadioButton
                id={input.name}
                name={input.name}
                onChange={input.onChange}
                onFocus={input.onFocus}
                onBlur={input.onBlur}
                checked={input.checked}
                disabled={disabled}
                value={input.value}
              >
                Show Display Names (if available)
              </RadioButton>
            </Localized>
          )}
        </Field>
        <Field
          name={"auth.displayName.enabled"}
          type="radio"
          parse={parseStringBool}
          value={false}
        >
          {({ input }) => (
            <Localized id="configure-auth-displayNamesConfig-hideDisplayNames">
              <RadioButton
                id={input.name}
                name={input.name}
                onChange={input.onChange}
                onFocus={input.onFocus}
                onBlur={input.onBlur}
                checked={input.checked}
                disabled={disabled}
                value={input.value}
              >
                Hide Display Names (if available)
              </RadioButton>
            </Localized>
          )}
        </Field>
      </Flex>
    </FormField>
  </HorizontalGutter>
);

export default DisplayNamesConfig;
