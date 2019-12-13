import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { Field, Form } from "react-final-form";

import {
  colorFromMeta,
  formatStringList,
  FormError,
  OnSubmit,
  parseStringList,
  ValidationMessage,
} from "coral-framework/lib/form";
import { validateStrictURLList } from "coral-framework/lib/validation";
import {
  Button,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components";

import BackButton from "./BackButton";

interface FormProps {
  allowedDomains: string[];
}

interface FormSubmitProps extends FormProps, FormError {}

interface Props {
  onGoToNextStep: () => void;
  onGoToPreviousStep: () => void;
  data: { allowedDomains: string[] };
  onInstall: (newData: { allowedDomains: string[] }) => Promise<void>;
}

class PermittedDomainsStep extends Component<Props> {
  private onSubmit: OnSubmit<FormSubmitProps> = async (
    { allowedDomains },
    form
  ) => {
    try {
      await this.props.onInstall({ allowedDomains });
      return this.props.onGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        initialValues={{
          allowedDomains: this.props.data.allowedDomains,
        }}
      >
        {({ handleSubmit, submitting, submitError }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter size="double">
              <Localized id="install-permittedDomains-title">
                <Typography variant="heading1" align="center">
                  Permitted Domains
                </Typography>
              </Localized>
              <Localized id="install-permittedDomains-description-with-scheme">
                <Typography variant="bodyCopy" align="center">
                  Enter the domains you would like to permit for Coral, e.g.
                  your local, staging and production environments including the
                  scheme (ex. http://localhost:3000, https://staging.domain.com,
                  https://domain.com).
                </Typography>
              </Localized>

              {submitError && (
                <CallOut color="error" fullWidth>
                  {submitError}
                </CallOut>
              )}

              <Field
                name="allowedDomains"
                parse={parseStringList}
                format={formatStringList}
                validate={validateStrictURLList}
              >
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-permittedDomains-permittedDomains">
                      <InputLabel container={<label htmlFor={input.name} />}>
                        Permitted Domains
                      </InputLabel>
                    </Localized>
                    <Localized id="install-permittedDomains-permittedDomainsDescription">
                      <InputDescription>
                        Insert domains separated by comma
                      </InputDescription>
                    </Localized>
                    <Localized
                      id="install-permittedDomains-permittedDomainsTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
                        placeholder="Domains"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>

              <Flex direction="row-reverse" itemGutter>
                <Localized id="install-permittedDomains-finishInstall">
                  <Button
                    variant="filled"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={submitting}
                  >
                    Finish Install
                  </Button>
                </Localized>
                <BackButton
                  submitting={submitting}
                  onGoToPreviousStep={this.props.onGoToPreviousStep}
                />
              </Flex>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    );
  }
}

export default PermittedDomainsStep;
