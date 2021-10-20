import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { Field, Form } from "react-final-form";

import { getImageValidators } from "../helpers/getMediaValidators";

import {
  Button,
  Flex,
  HorizontalGutter,
  InputLabel,
  TextField,
  ValidationMessage,
} from "coral-ui/components/v2";

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

  // This will handle when the user hits enter where we don't want to submit the
  // form.
  const onKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();
  }, []);

  return (
    <Form onSubmit={({ externalImg }) => onSelect(externalImg)}>
      {({ handleSubmit, submitting, pristine, invalid }) => (
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
                      name="externalImg"
                      id="coral-comments-postComment-pasteImage"
                      className={styles.input}
                      onKeyPress={onKeyPress}
                      fullWidth
                      variant="seamlessAdornment"
                      color="streamBlue"
                    />
                    <Localized id="comments-postComment-insertImage">
                      <Button
                        color="stream"
                        disabled={pristine || invalid || submitting}
                        onClick={() => handleSubmit()}
                        className={styles.insertButton}
                      >
                        Insert
                      </Button>
                    </Localized>
                  </Flex>
                </HorizontalGutter>
                {meta.dirty && meta.error && (
                  <ValidationMessage>{meta.error}</ValidationMessage>
                )}
              </HorizontalGutter>
            )}
          </Field>
        </div>
      )}
    </Form>
  );
};

export default ExternalImageInput;
