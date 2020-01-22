import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field, Form } from "react-final-form";

import { MarkdownEditor } from "coral-framework/components/loadables";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import {
  Button,
  FormField,
  FormFieldHeader,
  Label,
  Spinner,
} from "coral-ui/components/v2";

import ValidationMessage from "../../ValidationMessage";

// import styles from "./AnnouncementConfig.css";

interface Announcement {
  content: string;
  disableAt: Date;
}

interface Settings {
  announcement: Announcement | null;
}

interface Props {
  settings: Settings;
  onSubmit: (values: any) => void;
}

const AnnouncementConfig: FunctionComponent<Props> = ({
  settings,
  onSubmit,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, submitError, invalid, submitting, ...formProps }) => (
        <form onSubmit={handleSubmit}>
          <FormField>
            <FormFieldHeader>
              <Localized id="configure-general-announcement-title">
                <Label htmlFor="configure-general-announcement-content">
                  Announcement text
                </Label>
              </Localized>
            </FormFieldHeader>

            <Field
              name="content"
              parse={parseEmptyAsNull}
              defaultValue={
                settings.announcement ? settings.announcement.content : ""
              }
            >
              {({ input, meta }) => (
                <>
                  <Suspense fallback={<Spinner />}>
                    <MarkdownEditor
                      {...input}
                      id="configure-general-announcement-content"
                    />
                  </Suspense>
                  <ValidationMessage meta={meta} />
                </>
              )}
            </Field>
          </FormField>
          <Button type="submit">create</Button>
        </form>
      )}
    </Form>
  );
};

export default AnnouncementConfig;
