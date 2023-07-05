import { Localized } from "@fluent/react/compat";
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
} from "coral-ui/components/v2";

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
  siteName: string;
  siteContactEmail: string;
  siteURL: string;
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
          siteName: this.props.data.organizationName,
          siteContactEmail: this.props.data.siteContactEmail,
          siteURL: this.props.data.siteURL,
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
                <Typography variant="bodyCopy">
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
                      <InputLabel htmlFor={input.name}>
                        Organization name
                      </InputLabel>
                    </Localized>
                    <Localized
                      id="install-addOrganization-orgNameTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
                        placeholder="Organization Name"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>

              <Field
                name="siteContactEmail"
                validate={composeValidators(required, validateEmail)}
              >
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-addSite-siteEmail">
                      <InputLabel htmlFor={input.name}>
                        Contact email
                      </InputLabel>
                    </Localized>
                    <Localized
                      id="install-addSite-siteEmailTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
                        placeholder="Contact Email"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        type="email"
                        autoCapitalize="off"
                        autoCorrect="off"
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>

              <Field
                name="siteURL"
                validate={composeValidators(required, validateURL)}
              >
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-addSite-siteURL">
                      <InputLabel htmlFor={input.name}>
                        Organization URL
                      </InputLabel>
                    </Localized>
                    <Localized
                      id="install-addSite-siteURLDescription"
                      strong={<strong />}
                    >
                      <InputDescription>
                        {/* Related: https://github.com/prettier/prettier/issues/2347 */}
                        Be sure to include <strong>{"http://"}</strong> or{" "}
                        <strong>{"https://"}</strong> in your URL
                      </InputDescription>
                    </Localized>
                    <Localized
                      id="install-addSite-siteURLTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
                        placeholder="Organization URL"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>
              <Field name="siteName" validate={composeValidators(required)}>
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-addSite-siteName">
                      <InputLabel htmlFor={input.name}>Site name</InputLabel>
                    </Localized>
                    <Localized id="install-addSite-siteNameDescription">
                      <InputDescription>
                        Site name will appear on emails sent by Coral to your
                        community and organization members.
                      </InputDescription>
                    </Localized>
                    <Localized
                      id="install-addSite-siteNameTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
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
