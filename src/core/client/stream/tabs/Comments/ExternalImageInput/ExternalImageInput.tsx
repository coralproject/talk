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
  onImageInsert: (url: string) => void;
}

const ExternalImageInput: FunctionComponent<Props> = ({ onImageInsert }) => {
  const [url, setURL] = useState<string>("");
  const onURLFieldChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setURL(evt.target.value);
  }, []);
  const onInsertClick = useCallback(() => {
    onImageInsert(url);

    // TODO: we should handle this state better...
    setURL("");
  }, [url, setURL, onImageInsert]);

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
            onChange={onURLFieldChange}
            onKeyPress={onKeyPress}
            fullWidth
            variant="seamlessAdornment"
            color="streamBlue"
            adornment={
              <Localized id="comments-postComment-insertImage">
                <Button
                  color="stream"
                  onClick={onInsertClick}
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
