import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  Suspense,
  useCallback,
  useState,
} from "react";
import { Field, FormSpy } from "react-final-form";

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
  onSubmit?: (values: any) => void;
  disabled: boolean;
}

const AnnouncementForm: FunctionComponent<Props> = ({
  settings,
  onSubmit,
  disabled,
}) => {
  const [values, setValues] = useState({});
  const onButtonClick = useCallback(() => {
    if (onSubmit && !disabled) {
      onSubmit(values);
    }
  }, [values]);
  return (
    <>
      <FormSpy subscription={{ values: true }} onChange={v => setValues(v)} />
      <FormField>
        <FormFieldHeader>
          <Localized id="configure-general-announcement-title">
            <Label htmlFor="configure-general-announcement-content">
              Announcement text
            </Label>
          </Localized>
        </FormFieldHeader>

        <Field
          name="announcement.content"
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
      {onSubmit && <Button onClick={onButtonClick}>create</Button>}
    </>
  );
};

export default AnnouncementForm;
