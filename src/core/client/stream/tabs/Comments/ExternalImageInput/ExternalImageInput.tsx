/* eslint-disable */
import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Form, Field } from "react-final-form";

import { CallOut } from "coral-ui/components/v3";

import { getImageValidators } from "../helpers/getMediaValidators";

import {
  Button,
  Flex,
  HorizontalGutter,
  Icon,
  InputLabel,
  TextField,
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

  const [url, setURL] = useState("");

  // This will handle when the user hits enter where we don't want to submit the
  // form.
  const onKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();
  }, []);

  return (
    <Form
      onSubmit={() => {
        onSelect(url);
      }}
    >
      {({ handleSubmit }) => {
        return (
          <div className={styles.root}>
              <Field
                name="externalImg"
                validate={getImageValidators()}
              >
                {({ input, meta }) => {

                  return (
                    <HorizontalGutter>
                      <HorizontalGutter>
                        <Localized id="comments-postComment-pasteImage">
                          <InputLabel htmlFor="coral-comments-postComment-pasteImage">
                            Paste image URL
                          </InputLabel>
                        </Localized>
                        <Flex>
                          <TextField
                            name="externalImg"
                            id="coral-comments-postComment-pasteImage"
                            className={styles.input}
                            onChange={(evt) => {
                              setURL(evt.currentTarget.value);
                              input.onChange(evt);
                            }}
                            onKeyPress={onKeyPress}
                            fullWidth
                            variant="seamlessAdornment"
                            color="streamBlue"
                            ref={ref}
                          />
                          <Localized id="comments-postComment-insertImage">
                            <Button
                              color="stream"
                              disabled={!!meta.error}
                              onClick={(e) => {
                                if (!url || meta.error) return;

                                handleSubmit();
                              }}
                              className={styles.insertButton}
                            >
                              Insert
                            </Button>
                          </Localized>
                        </Flex>
                      </HorizontalGutter>
                      {meta.dirty && meta.error && (
                        <CallOut
                          color="error"
                          title={meta.error}
                          titleWeight="semiBold"
                          icon={<Icon>error</Icon>}
                          role="alert"
                        />
                      )}
                    </HorizontalGutter>
                  );
                }}
              </Field>
          </div>
        );
      }}
    </Form>
  );
};

export default ExternalImageInput;
