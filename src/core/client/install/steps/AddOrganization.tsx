import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
} from "talk-framework/lib/validation";
import {
  Button,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

interface FormProps {
  organizationName: string;
  organizationContactEmail: string;
}

export interface AddOrganizationForm {
  onSubmit: OnSubmit<FormProps>;
}

const AddOrganization: StatelessComponent<AddOrganizationForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="double">
            <Typography variant="heading1" align="center">
              Add Organization
            </Typography>
            <Typography variant="bodyCopy" align="center">
              Please tell us the name of your organization. This will appear in
              emails when inviting new team members.
            </Typography>

            <Field
              name="organizationName"
              validate={composeValidators(required)}
            >
              {({ input, meta }) => (
                <FormField>
                  <InputLabel>Organization Name</InputLabel>
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
                  <InputLabel>Organization Contact Email</InputLabel>
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

            <Button
              variant="filled"
              color="primary"
              size="large"
              type="submit"
              disabled={submitting}
              fullWidth
            >
              Save
            </Button>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default AddOrganization;
