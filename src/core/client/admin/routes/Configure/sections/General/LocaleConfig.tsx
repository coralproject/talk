import { Localized } from "@fluent/react/compat";
import React from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { required } from "coral-framework/lib/validation";
import { FormFieldDescription, HorizontalGutter } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import LocaleField from "../../Fields/LocaleField";
import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment LocaleConfig_formValues on Settings {
    locale
  }
`;

interface Props {
  disabled: boolean;
}

const LocaleConfig: React.FunctionComponent<Props> = props => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-general-locale-language">
          <Header htmlFor="configure-locale-locale">Language</Header>
        </Localized>
      }
    >
      <HorizontalGutter spacing={2}>
        <Localized id="configure-general-locale-chooseLanguage">
          <FormFieldDescription>
            Choose the language for your Coral community.
          </FormFieldDescription>
        </Localized>
        <Field name="locale" validate={required}>
          {({ input, meta }) => (
            <>
              <LocaleField
                {...input}
                id={`configure-locale-${input.name}`}
                disabled={props.disabled}
              />
              <ValidationMessage meta={meta} fullWidth />
            </>
          )}
        </Field>
      </HorizontalGutter>
    </ConfigBox>
  );
};

export default LocaleConfig;
