import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";

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
              <Localized id="install-permittedDomains-title">
                Permitted Domains
              </Localized>
            </Typography>
            <Typography variant="bodyCopy" align="center">
              <Localized id="install-permittedDomains-description">
                Enter the domains you would like to permit for Talk, e.g. your
                local, staging and production environments (ex. localhost:3000,
                staging.domain.com, domain.com).
              </Localized>
            </Typography>

            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}

            <Field name="domains">
              {({ input, meta }) => (
                <FormField>
                  <InputLabel>
                    <Localized id="install-permittedDomains-permttedDomains">
                      Permitted Domains
                    </Localized>
                  </InputLabel>
                  <InputDescription>
                    <Localized id="install-permittedDomains-permttedDomainsDescription">
                      Insert domains separated by comma
                    </Localized>
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
                <Localized id="install-finishInstall">Finish Install</Localized>
              </Button>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default AddOrganization;
