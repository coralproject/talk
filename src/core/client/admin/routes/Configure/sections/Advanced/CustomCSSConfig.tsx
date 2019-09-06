import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  formatEmpty,
  parseEmptyAsNull,
  ValidationMessage,
} from "coral-framework/lib/form";
import {
  FormField,
  HorizontalGutter,
  TextField,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
import SectionContent from "../../SectionContent";

interface Props {
  disabled: boolean;
}

const CustomCSSConfig: FunctionComponent<Props> = ({ disabled }) => (
  <FormField>
    <HorizontalGutter size="full">
      <Localized id="configure-advanced-customCSS">
        <Header container={<label htmlFor="configure-advanced-customCSSURL" />}>
          Custom CSS
        </Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-advanced-customCSS-explanation"
          strong={<strong />}
        >
          <Typography variant="bodyShort">
            URL of a CSS stylesheet that will override default Embed Stream
            styles. Can be internal or external.
          </Typography>
        </Localized>
        <Field
          name="customCSSURL"
          parse={parseEmptyAsNull}
          format={formatEmpty}
        >
          {({ input, meta }) => (
            <>
              <TextField
                id={`configure-advanced-${input.name}`}
                disabled={disabled}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                fullWidth
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

export default CustomCSSConfig;
