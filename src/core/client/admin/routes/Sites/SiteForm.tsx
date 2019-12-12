import { FormApi } from "final-form";
import { Link } from "found";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  required,
  validateStrictURLList,
} from "coral-framework/lib/validation";
import { Button } from "coral-ui/components/v2";

import { SiteForm_site as SiteData } from "coral-admin/__generated__/SiteForm_site.graphql";

import TextFieldWithValidation from "../Configure/TextFieldWithValidation";
import UpdateSiteMutation from "./UpdateSiteMutation";

interface Props {
  site: SiteData;
}

const SiteForm: FunctionComponent<Props> = ({ site }) => {
  const updateSite = useMutation(UpdateSiteMutation);
  const [success, setSuccess] = useState<boolean>(false);
  const onSubmit = useCallback(async (input, form: FormApi) => {
    const result = await updateSite({ site: input, id: site.id });
    if (result) {
      setSuccess(true);
    }
  }, []);
  return (
    <div>
      <Link to="/admin/configure/organization">Back to organization</Link>
      {success && <p>Successfully updated</p>}
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitError, invalid, submitting, ...formProps }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="name"
              validate={required}
              defaultValue={site.name}
              component="input"
            />
            <Field
              name="contactEmail"
              defaultValue={site.contactEmail}
              validate={required}
              component="input"
            />
            <Field
              name="url"
              defaultValue={site.url}
              validate={required}
              component="input"
            />
            <Field
              name="allowedDomains"
              defaultValue={site.allowedDomains}
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
            <Button type="submit">Submit</Button>
          </form>
        )}
      </Form>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment SiteForm_site on Site {
      name
      createdAt
      id
      contactEmail
      url
      allowedDomains
    }
  `,
})(SiteForm);

export default enhanced;
