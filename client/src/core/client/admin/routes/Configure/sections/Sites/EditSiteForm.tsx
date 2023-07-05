import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  required,
  validateStrictURLList,
} from "coral-framework/lib/validation";
import {
  Button,
  CallOut,
  Flex,
  FormField,
  FormFieldHeader,
  HorizontalGutter,
  Label,
} from "coral-ui/components/v2";

import { EditSiteForm_settings as SettingsData } from "coral-admin/__generated__/EditSiteForm_settings.graphql";
import { EditSiteForm_site as SiteData } from "coral-admin/__generated__/EditSiteForm_site.graphql";
import { UpdateSite } from "coral-admin/__generated__/UpdateSiteMutation.graphql";

import HelperText from "../../HelperText";
import TextFieldWithValidation from "../../TextFieldWithValidation";
import EmbedCode from "./EmbedCode";
import UpdateSiteMutation from "./UpdateSiteMutation";

interface Props {
  site: SiteData;
  settings: SettingsData;
  onEditSuccess: (name: string) => void;
}

const EditSiteForm: FunctionComponent<Props> = ({
  site,
  settings,
  onEditSuccess,
}) => {
  const updateSite = useMutation(UpdateSiteMutation);
  const [submitError, setSubmitError] = useState<null | string>(null);
  const onSubmit = useCallback(async (input: UpdateSite) => {
    try {
      const result = await updateSite({ site: input, id: site.id });
      if (result) {
        onEditSuccess(result.site.name);
      }
    } catch (error) {
      setSubmitError(error.message);
    }
  }, []);
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
                <Field name="name" validate={required} defaultValue={site.name}>
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
                  defaultValue={site.allowedOrigins}
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
              <FormField>
                <FormFieldHeader>
                  <Localized id="configure-sites-site-form-embed-code">
                    <Label>Embed code</Label>
                  </Localized>
                </FormFieldHeader>

                <EmbedCode staticURI={settings.staticURI} />
              </FormField>
              {submitError && (
                <CallOut fullWidth color="error">
                  {submitError}
                </CallOut>
              )}
              <Flex itemGutter justifyContent="flex-end">
                <Localized id="configure-sites-site-form-save">
                  <Button
                    disabled={submitting}
                    iconLeft
                    type="submit"
                    size="large"
                  >
                    Save changes
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

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment EditSiteForm_site on Site {
      name
      createdAt
      id
      allowedOrigins
    }
  `,
  settings: graphql`
    fragment EditSiteForm_settings on Settings {
      staticURI
    }
  `,
})(EditSiteForm);

export default enhanced;
