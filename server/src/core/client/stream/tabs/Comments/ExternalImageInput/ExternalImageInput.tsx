import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";
import { Field, Form } from "react-final-form";

import { ValidationMessage } from "coral-framework/lib/form";
import {
  Button,
  Flex,
  HorizontalGutter,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";

import { getImageValidators } from "../helpers/getMediaValidators";

import styles from "./ExternalImageInput.css";

interface Props {
  onSelect: (url: string) => void;
}

const ExternalImageInput: FunctionComponent<Props> = ({ onSelect }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Form onSubmit={({ externalImg }) => onSelect(externalImg)}>
      {({ handleSubmit, submitting, pristine }) => (
        <div className={styles.root}>
          <Field name="externalImg" validate={getImageValidators()}>
            {({ input, meta }) => (
              <HorizontalGutter>
                <HorizontalGutter>
                  <Localized id="comments-postComment-pasteImage">
                    <InputLabel htmlFor="coral-comments-postComment-pasteImage">
                      Paste image URL
                    </InputLabel>
                  </Localized>
                  <Flex>
                    <TextField
                      {...input}
                      id="coral-comments-postComment-pasteImage"
                      className={styles.input}
                      onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key !== "Enter") {
                          return;
                        }
                        void handleSubmit();
                        // This will handle when the user hits enter where we don't want to submit the
                        // parent form.
                        e.preventDefault();
                      }}
                      fullWidth
                      variant="seamlessAdornment"
                      color="streamBlue"
                      ref={ref}
                    />
                    <Localized id="comments-postComment-insertImage">
                      <Button
                        color="stream"
                        disabled={pristine || submitting}
                        onClick={() => handleSubmit()}
                        className={styles.insertButton}
                      >
                        Insert
                      </Button>
                    </Localized>
                  </Flex>
                </HorizontalGutter>
                <ValidationMessage meta={meta} />
              </HorizontalGutter>
            )}
          </Field>
        </div>
      )}
    </Form>
  );
};

export default ExternalImageInput;
