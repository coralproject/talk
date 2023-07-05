import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { LanguageCode } from "coral-common/helpers/i18n";
import { LocaleField } from "coral-framework/components";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { OnSubmit, ValidationMessage } from "coral-framework/lib/form";
import { required } from "coral-framework/lib/validation";
import {
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  Typography,
} from "coral-ui/components/v2";

import NextButton from "./NextButton";

interface FormProps {
  locale: string;
}

interface Props {
  onGoToNextStep: () => void;
  onGoToPreviousStep: () => void;
  data: FormProps;
  onSaveData: (newData: FormProps) => void;
}

const SelectLanguageStep: FunctionComponent<Props> = (props) => {
  const { changeLocale } = useCoralContext();
  const onSubmit = useCallback<OnSubmit<FormProps>>(
    async (input, form) => {
      props.onSaveData(input);
      await changeLocale(input.locale as LanguageCode);
      return props.onGoToNextStep();
    },
    [changeLocale, props.onSaveData, props.onGoToNextStep]
  );

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        locale: props.data.locale,
      }}
    >
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="double">
            <Localized id="install-selectLanguage-selectLanguage">
              <Typography variant="heading1" align="center">
                Select language for Coral
              </Typography>
            </Localized>

            <Localized id="install-selectLanguage-description">
              <Typography variant="bodyCopy">
                Choose the language to be used during the installation process.
                This will also be the default language for your Coral community.
              </Typography>
            </Localized>

            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}

            <Field name="locale" validate={required}>
              {({ input, meta }) => (
                <FormField>
                  <Localized id="install-selectLanguage-language">
                    <InputLabel htmlFor={input.name}>Language</InputLabel>
                  </Localized>
                  <LocaleField
                    disabled={submitting}
                    fullWidth
                    id={input.name}
                    {...input}
                  />
                  <ValidationMessage meta={meta} fullWidth />
                </FormField>
              )}
            </Field>
            <Flex direction="row-reverse">
              <NextButton submitting={submitting} />
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SelectLanguageStep;
