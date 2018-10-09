import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
  validateURL,
} from "talk-framework/lib/validation";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";
import { FormData } from "../../containers/AppContainer";
import * as styles from "./styles.css";

interface FormProps {
  organizationName: string;
  organizationContactEmail: string;
}

export interface AddOrganizationForm {
  onSubmit: OnSubmit<FormProps>;
  handleonGoToPreviousStep: () => void;
  data: FormData;
}

const AddOrganization: StatelessComponent<AddOrganizationForm> = props => {
  return (
    <Form
      onSubmit={props.onSubmit}
      initialValues={{
        organizationName: props.data.organizationName,
        organizationContactEmail: props.data.organizationContactEmail,
        organizationURL: props.data.organizationURL,
      }}
    >
      {({ handleSubmit, submitting, submitError }) => (
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          className={styles.form}
        >
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
                    <InputLabel>Organization Name</InputLabel>
                  </Localized>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Organization Name"
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    disabled={submitting}
                    fullWidth
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
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
                    <InputLabel>Organization Contact Email</InputLabel>
                  </Localized>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Organization Contact Email"
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    disabled={submitting}
                    fullWidth
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
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
                    <InputLabel>Organization URL</InputLabel>
                  </Localized>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Organization URL"
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    disabled={submitting}
                    fullWidth
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </FormField>
              )}
            </Field>
            <Flex direction="row" itemGutter>
              <Localized id="install-back">
                <Button
                  onClick={props.handleonGoToPreviousStep}
                  variant="filled"
                  color="regular"
                  size="large"
                  type="submit"
                  disabled={submitting}
                  fullWidth
                >
                  Back
                </Button>
              </Localized>
              <Button
                variant="filled"
                color="primary"
                size="large"
                type="submit"
                disabled={submitting}
                fullWidth
              >
                <Localized id="install-next">
                  <span>Next</span>
                </Localized>
                <ButtonIcon className={styles.buttonIcon}>
                  arrow_forward
                </ButtonIcon>
              </Button>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default AddOrganization;
