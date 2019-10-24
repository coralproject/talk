import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { formatEmpty, parseEmptyAsNull } from "coral-framework/lib/form";

import { FormField } from "coral-admin/ui/components";

import ConfigBox from "../../ConfigBox";
import Description from "../../Description";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

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
      <Localized
        id="configure-advanced-customCSS-explanation"
        strong={<strong />}
      >
        <Description>
          URL of a CSS stylesheet that will override default Embed Stream
          styles. Can be internal or external.
        </Description>
      </Localized>
      <Field name="customCSSURL" parse={parseEmptyAsNull} format={formatEmpty}>
        {({ input, meta }) => (
          <TextFieldWithValidation
            id={`configure-advanced-${input.name}`}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            fullWidth
            meta={meta}
            {...input}
          />
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default CustomCSSConfig;
