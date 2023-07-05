import { Localized } from "@fluent/react/compat";
import React from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { LOCALES_MAP } from "coral-common/helpers/i18n/locales";
import { required } from "coral-framework/lib/validation";
import {
  CallOut,
  FormFieldDescription,
  HorizontalGutter,
} from "coral-ui/components/v2";

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

const LocaleConfig: React.FunctionComponent<Props> = (props) => {
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
          {({ input, meta }) => {
            const notExist = !(input.value in LOCALES_MAP);
            const InvalidLanguage = () => <code>{input.value}</code>;
            return (
              <>
                {notExist && (
                  <Localized
                    id="configure-general-locale-invalidLanguage"
                    elems={{ Lang: <InvalidLanguage /> }}
                  >
                    <CallOut color="error">
                      The previously selected language <InvalidLanguage /> no
                      longer exists. Please choose a different language.
                    </CallOut>
                  </Localized>
                )}
                <LocaleField
                  {...input}
                  id={`configure-locale-${input.name}`}
                  disabled={props.disabled}
                />
                <ValidationMessage meta={meta} fullWidth />
              </>
            );
          }}
        </Field>
      </HorizontalGutter>
    </ConfigBox>
  );
};

export default LocaleConfig;
