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
  const [error, setError] = useState(undefined);

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
      {(args) => {
        return (
          <div className={styles.root}>
            <HorizontalGutter>
              <HorizontalGutter>
                <Localized id="comments-postComment-pasteImage">
                  <InputLabel htmlFor="coral-comments-postComment-pasteImage">
                    Paste image URL
                  </InputLabel>
                </Localized>
                <Flex>
                  <Field
                    name="externalImg"
                    validate={getImageValidators()}
                  >
                    {(props) => {
                      const {
                        input,
                        meta,
                      } = props;

                      if (meta.dirty && meta.error) {
                        setError(meta.error);
                      }

                      const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
                        setURL(evt.currentTarget.value);
                      }, []);

                      return (
                        <>
                          <TextField
                            name="externalImg"
                            id="coral-comments-postComment-pasteImage"
                            className={styles.input}
                            onChange={(evt) => {
                              onChange(evt);
                              input.onChange(evt);
                            }}
                            onKeyPress={onKeyPress}
                            fullWidth
                            variant="seamlessAdornment"
                            color="streamBlue"
                            ref={ref}
                          />
                        </>
                      );
                    }}
                  </Field>

                  <Localized id="comments-postComment-insertImage">
                    <Button
                      color="stream"
                      onClick={(e) => {
                        if (!url || error) return;

                        args.handleSubmit();
                      }}
                      className={styles.insertButton}
                    >
                      Insert
                    </Button>
                  </Localized>
                </Flex>
              </HorizontalGutter>
              {error && (
                  <CallOut
                    color="error"
                    title={error}
                    titleWeight="semiBold"
                    icon={<Icon>error</Icon>}
                    role="alert"
                  />
                )}
            </HorizontalGutter>
          </div>
        )
      }}
    </Form>

  );
};

export default ExternalImageInput;
