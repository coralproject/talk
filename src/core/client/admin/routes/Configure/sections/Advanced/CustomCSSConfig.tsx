import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { formatEmpty, parseEmptyAsNull } from "coral-framework/lib/form";
import { FormField, FormFieldDescription } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment CustomCSSConfig_formValues on Settings {
    customCSSURL
  }
`;

interface Props {
  disabled: boolean;
}

const CustomCSSConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-advanced-customCSS">
        <Header htmlFor="configure-advanced-customCSSURL">Custom CSS</Header>
      </Localized>
    }
  >
    <FormField>
      <Localized id="configure-advanced-customCSS-override" strong={<strong />}>
        <FormFieldDescription>
          URL of a CSS stylesheet that will override default Embed Stream
          styles.
        </FormFieldDescription>
      </Localized>
      <Field name="customCSSURL" parse={parseEmptyAsNull} format={formatEmpty}>
        {({ input, meta }) => (
          <TextFieldWithValidation
            {...input}
            id={`configure-advanced-${input.name}`}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            fullWidth
            meta={meta}
          />
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default CustomCSSConfig;
