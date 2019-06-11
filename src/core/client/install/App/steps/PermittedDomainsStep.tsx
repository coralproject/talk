import { OnSubmit } from "coral-framework/lib/form";
import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { Field, Form } from "react-final-form";

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
  ValidationMessage,
} from "coral-ui/components";

import BackButton from "./BackButton";

interface FormProps {
  allowedDomains: string;
}

interface Props {
  onGoToNextStep: () => void;
  onGoToPreviousStep: () => void;
  data: { allowedDomains: string[] };
  onInstall: (newData: { allowedDomains: string[] }) => Promise<void>;
}

class PermittedDomainsStep extends Component<Props> {
  private onSubmit: OnSubmit<FormProps> = async (input, form) => {
    try {
      const allowedDomains = input.allowedDomains.split(",");
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
          allowedDomains: this.props.data.allowedDomains.join(","),
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
              <Localized id="install-permittedDomains-description">
                <Typography variant="bodyCopy" align="center">
                  Enter the domains you would like to permit for Coral, e.g.
                  your local, staging and production environments (ex.
                  localhost:3000, staging.domain.com, domain.com).
                </Typography>
              </Localized>

              {submitError && (
                <CallOut color="error" fullWidth>
                  {submitError}
                </CallOut>
              )}

              <Field name="allowedDomains">
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-permittedDomains-permittedDomains">
                      <InputLabel>Permitted Domains</InputLabel>
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
                        name={input.name}
                        onChange={input.onChange}
                        value={input.value}
                        placeholder="Domains"
                        color={
                          meta.touched && (meta.error || meta.submitError)
                            ? "error"
                            : "regular"
                        }
                        disabled={submitting}
                        fullWidth
                      />
                    </Localized>
                    {meta.touched && (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
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
