import { Localized } from "fluent-react/compat";
import React from "react";
import { Field, Form } from "react-final-form";

import {
  colorFromMeta,
  OnSubmit,
  ValidationMessage,
} from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
  validateURL,
} from "coral-framework/lib/validation";
import {
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
import NextButton from "./NextButton";

interface Props {
  onGoToNextStep: () => void;
  onGoToPreviousStep: () => void;
  data: FormProps;
  onSaveData: (newData: FormProps) => void;
}

interface FormProps {
  organizationName: string;
  organizationContactEmail: string;
  organizationURL: string;
}

class AddOrganizationStep extends React.Component<Props> {
  private onSubmit: OnSubmit<FormProps> = async (input, form) => {
    this.props.onSaveData(input);
    return this.props.onGoToNextStep();
  };
  public render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        initialValues={{
          organizationName: this.props.data.organizationName,
          organizationContactEmail: this.props.data.organizationContactEmail,
          organizationURL: this.props.data.organizationURL,
        }}
      >
        {({ handleSubmit, submitting, submitError }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter size="double">
              <Localized id="install-addOrganization-title">
                <Typography variant="heading1" align="center">
                  Add Organization
                </Typography>
              </Localized>
              <Localized id="install-addOrganization-description">
                <Typography variant="bodyCopy" align="center">
                  Please tell us the name of your organization. This will appear
                  in emails when inviting new team members.
                </Typography>
              </Localized>

              {submitError && (
                <CallOut color="error" fullWidth>
                  {submitError}
                </CallOut>
              )}

              <Field
                name="organizationName"
                validate={composeValidators(required)}
              >
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-addOrganization-orgName">
                      <InputLabel container={<label htmlFor={input.name} />}>
                        Organization Name
                      </InputLabel>
                    </Localized>
                    <Localized
                      id="install-addOrganization-orgNameTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        placeholder="Organization Name"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        fullWidth
                        id={input.name}
                        {...input}
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>

              <Field
                name="organizationContactEmail"
                validate={composeValidators(required, validateEmail)}
              >
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-addOrganization-orgEmail">
                      <InputLabel container={<label htmlFor={input.name} />}>
                        Organization Contact Email
                      </InputLabel>
                    </Localized>
                    <Localized
                      id="install-addOrganization-orgEmailTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        placeholder="Organization Contact Email"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        type="email"
                        autoCapitalize="off"
                        autoCorrect="off"
                        fullWidth
                        id={input.name}
                        {...input}
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>

              <Field
                name="organizationURL"
                validate={composeValidators(required, validateURL)}
              >
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-addOrganization-orgURL">
                      <InputLabel container={<label htmlFor={input.name} />}>
                        Organization URL
                      </InputLabel>
                    </Localized>
                    <Localized
                      id="install-addOrganization-orgURLDescription"
                      strong={<strong />}
                    >
                      <InputDescription>
                        {/* Related: https://github.com/prettier/prettier/issues/2347 */}
                        Be sure to include <strong>{"http://"}</strong> or{" "}
                        <strong>{"https://"}</strong> in your URL
                      </InputDescription>
                    </Localized>
                    <Localized
                      id="install-addOrganization-orgURLTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        placeholder="Organization URL"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        fullWidth
                        id={input.name}
                        {...input}
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>
              <Flex direction="row-reverse" itemGutter>
                <NextButton submitting={submitting} />
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

export default AddOrganizationStep;
