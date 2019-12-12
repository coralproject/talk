import { FormApi } from "final-form";
import { Link } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  required,
  validateStrictURLList,
} from "coral-framework/lib/validation";
import { Button } from "coral-ui/components/v2";

import TextFieldWithValidation from "../Configure/TextFieldWithValidation";
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
      <Link to="/admin/configure/organization">Back to organization</Link>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitError, invalid, submitting, ...formProps }) => (
          <form onSubmit={handleSubmit}>
            <Field name="name" validate={required} component="input" />
            <Field name="contactEmail" validate={required} component="input" />
            <Field name="url" validate={required} component="input" />
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
            <Button type="submit">Submit</Button>
          </form>
        )}
      </Form>
    </div>
  );
};

export default CreateSiteForm;
