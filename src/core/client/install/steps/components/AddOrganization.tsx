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
  handleGoToPreviousStep: () => void;
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
            <Typography variant="heading1" align="center">
              <Localized id="install-addOrganization-title">
                Add Organization
              </Localized>
            </Typography>
            <Typography variant="bodyCopy" align="center">
              <Localized id="install-addOrganization-description">
                Please tell us the name of your organization. This will appear
                in emails when inviting new team members.
              </Localized>
            </Typography>

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
                  <InputLabel>
                    <Localized id="install-addOrganization-orgName">
                      Organization Name
                    </Localized>
                  </InputLabel>
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
                  <InputLabel>
                    <Localized id="install-addOrganization-orgEmail">
                      Organization Contact Email
                    </Localized>
                  </InputLabel>
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
                  <InputLabel>
                    <Localized id="install-addOrganization-orgURL">
                      Organization URL
                    </Localized>
                  </InputLabel>
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
              <Button
                onClick={props.handleGoToPreviousStep}
                variant="filled"
                color="regular"
                size="large"
                type="submit"
                disabled={submitting}
                fullWidth
              >
                <Localized id="install-back">Back</Localized>
              </Button>

              <Button
                variant="filled"
                color="primary"
                size="large"
                type="submit"
                disabled={submitting}
                fullWidth
              >
                <Localized id="install-next">Next</Localized>
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
