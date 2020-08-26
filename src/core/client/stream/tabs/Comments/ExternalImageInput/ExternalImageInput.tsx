import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useState,
} from "react";

import {
  Button,
  HorizontalGutter,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";

import styles from "./ExternalImageInput.css";

interface Props {
  onSelect: (url: string) => void;
}

const ExternalImageInput: FunctionComponent<Props> = ({ onSelect }) => {
  const [url, setURL] = useState<string>("");

  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setURL(evt.target.value);
  }, []);

  const onClick = useCallback(() => {
    onSelect(url);

    // TODO: we should handle this state better...
    setURL("");
  }, [url, setURL, onSelect]);

  // This will handle when the user hits enter where we don't want to submit the
  // form.
  const onKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();
  }, []);

  return (
    <div className={styles.root}>
      <HorizontalGutter>
        <HorizontalGutter>
          <Localized id="comments-postComment-pasteImage">
            <InputLabel>Paste image URL</InputLabel>
          </Localized>
          <TextField
            className={styles.input}
            value={url}
            onChange={onChange}
            onKeyPress={onKeyPress}
            fullWidth
            variant="seamlessAdornment"
            color="streamBlue"
            adornment={
              <Localized id="comments-postComment-insertImage">
                <Button
                  color="stream"
                  onClick={onClick}
                  className={styles.insertButton}
                >
                  Insert
                </Button>
              </Localized>
            }
          />
        </HorizontalGutter>
      </HorizontalGutter>
    </div>
  );
};

export default ExternalImageInput;
