import { Localized } from "fluent-react/compat";
import React, { useMemo } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import { FormFieldDescription, HorizontalGutter } from "coral-ui/components/v2";

import { LocaleConfigContainer_settings } from "coral-admin/__generated__/LocaleConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import LocaleField from "../../Fields/LocaleField";
import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  settings: LocaleConfigContainer_settings;
  onInitValues: (values: LocaleConfigContainer_settings) => void;
  disabled: boolean;
}

const LocaleConfigContainer: React.FunctionComponent<Props> = props => {
  useMemo(() => props.onInitValues(props.settings), [props.onInitValues]);
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
                id={`configure-locale-${input.name}`}
                disabled={props.disabled}
                {...input}
              />
              <ValidationMessage meta={meta} fullWidth />
            </>
          )}
        </Field>
      </HorizontalGutter>
    </ConfigBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment LocaleConfigContainer_settings on Settings {
      locale
    }
  `,
})(LocaleConfigContainer);

export default enhanced;
