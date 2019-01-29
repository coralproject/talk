import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import {
  FormField,
  HorizontalGutter,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import Header from "../../../components/Header";

interface Props {
  disabled: boolean;
}

const CustomCSSConfig: StatelessComponent<Props> = ({ disabled }) => (
  <FormField>
    <HorizontalGutter size="full">
      <Localized id="configure-advanced-customCSS">
        <Header>Custom CSS</Header>
      </Localized>
      <Localized
        id="configure-advanced-customCSS-explanation"
        strong={<strong />}
      >
        <Typography variant="detail">
          URL of a CSS stylesheet that will override default Embed Stream
          styles. Can be internal or external.
        </Typography>
      </Localized>
      <Field name="customCssUrl">
        {({ input, meta }) => (
          <>
            <TextField
              name={input.name}
              onChange={input.onChange}
              value={input.value}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              fullWidth
            />
            {meta.touched &&
              (meta.error || meta.submitError) && (
                <ValidationMessage fullWidth>
                  {meta.error || meta.submitError}
                </ValidationMessage>
              )}
          </>
        )}
      </Field>
    </HorizontalGutter>
  </FormField>
);

export default CustomCSSConfig;
