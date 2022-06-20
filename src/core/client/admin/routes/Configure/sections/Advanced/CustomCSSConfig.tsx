import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { formatEmpty, parseEmptyAsNull } from "coral-framework/lib/form";
import { FormField, FormFieldHeader, Label } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import HelperText from "../../HelperText";
import TextFieldWithValidation from "../../TextFieldWithValidation";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment CustomCSSConfig_formValues on Settings {
    customFontsCSSURL
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
      <FormFieldHeader>
        <Localized id="configure-advanced-customCSS-stylesheetURL">
          <Label>Custom CSS Stylesheet URL</Label>
        </Localized>
        <Localized id="configure-advanced-customCSS-override">
          <HelperText>
            URL of a Custom CSS stylesheet that will override default Embed
            styles.
          </HelperText>
        </Localized>
      </FormFieldHeader>
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
    <FormField>
      <FormFieldHeader>
        <Localized id="configure-advanced-customCSS-fontsStylesheetURL">
          <Label>Custom CSS Style Sheet URL for Font Faces</Label>
        </Localized>
        <Localized id="configure-advanced-customCSS-containsFontFace">
          <HelperText>
            URL to a Custom CSS stylesheets that contains all @font-face
            definitions needed by above Stylesheet.
          </HelperText>
        </Localized>
      </FormFieldHeader>
      <Field
        name="customFontsCSSURL"
        parse={parseEmptyAsNull}
        format={formatEmpty}
      >
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
