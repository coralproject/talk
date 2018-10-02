import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import {
  Button,
  CallOut,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";
import { FormData } from "../../containers/AppContainer";
import * as styles from "./styles.css";

interface FormProps {
  domains: string;
}

export interface PermittedDomainsForm {
  onSubmit: OnSubmit<FormProps>;
  handleGoToPreviousStep: () => void;
  data: FormData;
}

const AddOrganization: StatelessComponent<PermittedDomainsForm> = props => {
  return (
    <Form
      onSubmit={props.onSubmit}
      initialValues={{
        domains: props.data.domains.join(","),
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
              Permitted Domains
            </Typography>
            <Typography variant="bodyCopy" align="center">
              Enter the domains you would like to permit for Talk, e.g. your
              local, staging and production environments (ex. localhost:3000,
              staging.domain.com, domain.com).
            </Typography>

            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}

            <Field name="domains">
              {({ input, meta }) => (
                <FormField>
                  <InputLabel>Permitted Domains</InputLabel>
                  <InputDescription>
                    Insert domains separated by comma
                  </InputDescription>
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
              Finish install
            </Button>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default AddOrganization;
