import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  required,
  validateStrictURLList,
} from "coral-framework/lib/validation";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  FormFieldHeader,
  HorizontalGutter,
  Label,
} from "coral-ui/components/v2";

import { CreateSite } from "coral-admin/__generated__/CreateSiteMutation.graphql";

import HelperText from "../../HelperText";
import TextFieldWithValidation from "../../TextFieldWithValidation";
import CreateSiteMutation from "./CreateSiteMutation";

interface Props {
  onCreate: (id: string, name: string) => void;
}

const CreateSiteForm: FunctionComponent<Props> = ({ onCreate }) => {
  const createSite = useMutation(CreateSiteMutation);
  const [submitError, setSubmitError] = useState<null | string>(null);
  const onSubmit = useCallback(
    async (input: CreateSite) => {
      try {
        const response = await createSite({ site: input });
        if (response && response.site) {
          onCreate(response.site.id, response.site.name);
        }
      } catch (error) {
        setSubmitError(error.message);
      }
    },
    [onCreate]
  );
  return (
    <div>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, invalid, submitting, ...formProps }) => (
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
                  name="allowedOrigins"
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
              {submitError && (
                <CallOut fullWidth color="error">
                  {submitError}
                </CallOut>
              )}
              <Flex itemGutter justifyContent="flex-end">
                <Localized id="configure-sites-site-form-cancel">
                  <Button
                    variant="outlined"
                    size="large"
                    color="mono"
                    to="/admin/configure/organization"
                  >
                    Cancel
                  </Button>
                </Localized>
                <Localized
                  id="configure-sites-site-form-submit"
                  elems={{ icon: <ButtonIcon>add</ButtonIcon> }}
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
