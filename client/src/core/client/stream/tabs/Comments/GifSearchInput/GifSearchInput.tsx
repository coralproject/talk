import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, KeyboardEvent } from "react";

import { ButtonSvgIcon, SearchIcon } from "coral-ui/components/icons";
import {
  Button,
  HorizontalGutter,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";

import styles from "./GifSearchInput.css";

interface GifSearchInputProps {
  debouncedQuery: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const GifSearchInput: FunctionComponent<GifSearchInputProps> = ({
  debouncedQuery,
  onChange,
  onKeyPress,
  inputRef,
}) => {
  return (
    <HorizontalGutter>
      <Localized id="comments-postComment-gifSearch">
        <InputLabel htmlFor="coral-comments-postComment-gifSearch">
          Search for a GIF
        </InputLabel>
      </Localized>
      <TextField
        className={styles.input}
        value={debouncedQuery}
        onChange={onChange}
        onKeyPress={onKeyPress}
        fullWidth
        variant="seamlessAdornment"
        color="streamBlue"
        id="coral-comments-postComment-gifSearch"
        adornment={
          <Localized
            id="comments-postComment-gifSearch-search"
            attrs={{ "aria-label": true }}
          >
            <Button
              color="stream"
              className={styles.searchButton}
              aria-label="Search"
            >
              <ButtonSvgIcon Icon={SearchIcon} />
            </Button>
          </Localized>
        }
        ref={inputRef}
      />
    </HorizontalGutter>
  );
};
