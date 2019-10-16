import { Localized } from "fluent-react/compat";
import React, { useMemo } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { LocaleField } from "coral-framework/components";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import { FormField, HorizontalGutter, Typography } from "coral-ui/components";

import { LocaleConfigContainer_settings } from "coral-admin/__generated__/LocaleConfigContainer_settings.graphql";

import Header from "../../Header";
import SectionContent from "../../SectionContent";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  settings: LocaleConfigContainer_settings;
  onInitValues: (values: LocaleConfigContainer_settings) => void;
  disabled: boolean;
}

const LocaleConfigContainer: React.FunctionComponent<Props> = props => {
  useMemo(() => props.onInitValues(props.settings), [props.onInitValues]);
  return (
    <FormField>
      <HorizontalGutter size="full">
        <Localized id="configure-general-locale-language">
          <Header container={<label htmlFor="configure-locale-locale" />}>
            Language
          </Header>
        </Localized>
        <SectionContent>
          <Localized
            id="configure-general-locale-chooseLanguage"
            strong={<strong />}
          >
            <Typography variant="detail">
              Choose the language for your Coral community.
            </Typography>
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
        </SectionContent>
      </HorizontalGutter>
    </FormField>
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
