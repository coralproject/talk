import { Localized } from "@fluent/react/compat";
import { FormApi } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateEmail,
  validateStrictURLList,
  validateURL,
} from "coral-framework/lib/validation";
import {
  Button,
  ButtonIcon,
  Flex,
  FormField,
  FormFieldHeader,
  HorizontalGutter,
  Label,
} from "coral-ui/components/v2";

import HelperText from "../../HelperText";
import TextFieldWithValidation from "../../TextFieldWithValidation";
import CreateSiteMutation from "./CreateSiteMutation";

interface Props {
  onCreate: (id: string) => void;
}

const CreateSiteForm: FunctionComponent<Props> = ({ onCreate }) => {
  const createSite = useMutation(CreateSiteMutation);
  const onSubmit = useCallback(
    async (input, form: FormApi) => {
      const response = await createSite({ site: input });
      if (response && response.site) {
        onCreate(response.site.id);
      }
    },
    [onCreate]
  );
  return (
    <div>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitError, invalid, submitting, ...formProps }) => (
          <form onSubmit={handleSubmit}>
            <HorizontalGutter spacing={4}>
              <FormField>
                <FormFieldHeader>
                  <Localized id="configure-sites-site-form-name">
                    <Label>Site name</Label>
                  </Localized>
                  <Localized id="configure-sites-site-form-name-explanation">
                    <HelperText>
                      Site name will appear on emails sent by Coral to your
                      community and organization members.
                    </HelperText>
                  </Localized>
                </FormFieldHeader>
                <Field name="name" validate={required}>
                  {({ input, meta }) => (
                    <TextFieldWithValidation
                      {...input}
                      id={input.name}
                      fullWidth
                      meta={meta}
                    />
                  )}
                </Field>
              </FormField>
              <FormField>
                <FormFieldHeader>
                  <Localized id="configure-sites-site-form-url">
                    <Label>Site URL</Label>
                  </Localized>
                  <Localized id="configure-sites-site-form-url-explanation">
                    <HelperText>
                      This url will appear on emails sent by Coral to your
                      community members.
                    </HelperText>
                  </Localized>
                </FormFieldHeader>
                <Field
                  name="url"
                  validate={composeValidators(required, validateURL)}
                >
                  {({ input, meta }) => (
                    <TextFieldWithValidation
                      {...input}
                      id={input.name}
                      fullWidth
                      meta={meta}
                    />
                  )}
                </Field>
              </FormField>
              <FormField>
                <FormFieldHeader>
                  <Localized id="configure-sites-site-form-email">
                    <Label>Site email address</Label>
                  </Localized>
                  <Localized id="configure-sites-site-form-email-explanation">
                    <HelperText>
                      This email address is for community members to contact you
                      with questions or if they need help. e.g.
                      comments@yoursite.com
                    </HelperText>
                  </Localized>
                </FormFieldHeader>
                <Field
                  name="contactEmail"
                  validate={composeValidators(required, validateEmail)}
                >
                  {({ input, meta }) => (
                    <TextFieldWithValidation
                      {...input}
                      id={input.name}
                      fullWidth
                      meta={meta}
                    />
                  )}
                </Field>
              </FormField>
              <FormField>
                <FormFieldHeader>
                  <Localized id="configure-sites-site-form-domains">
                    <Label>Site permitted domains</Label>
                  </Localized>
                  <Localized id="configure-sites-site-form-domains-explanation">
                    <HelperText>
                      Domains where your Coral comment streams are allowed to be
                      embedded (ex. http://localhost:3000,
                      https://staging.domain.com, https://domain.com).
                    </HelperText>
                  </Localized>
                </FormFieldHeader>
                <Field
                  name="allowedDomains"
                  parse={parseStringList}
                  format={formatStringList}
                  validate={validateStrictURLList}
                >
                  {({ input, meta }) => (
                    <TextFieldWithValidation
                      {...input}
                      id={`configure-advanced-${input.name}`}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      meta={meta}
                      fullWidth
                    />
                  )}
                </Field>
              </FormField>
              <Flex itemGutter justifyContent="flex-end">
                <Localized id="configure-sites-site-form-cancel">
                  <Button
                    variant="outline"
                    size="large"
                    color="mono"
                    to="/admin/configure/organization"
                  >
                    Cancel
                  </Button>
                </Localized>
                <Localized
                  id="configure-sites-site-form-submit"
                  icon={<ButtonIcon>add</ButtonIcon>}
                >
                  <Button
                    disabled={submitting}
                    iconLeft
                    type="submit"
                    size="large"
                  >
                    Add site
                  </Button>
                </Localized>
              </Flex>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default CreateSiteForm;
