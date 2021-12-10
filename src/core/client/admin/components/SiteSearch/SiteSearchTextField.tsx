import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button, Flex, Icon, TextField } from "coral-ui/components/v2";

import styles from "./SiteSearchTextField.css";

interface Props {
  onSearch: (event: React.SyntheticEvent) => void;
  onClearSearch: () => void;
  onSearchTextChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const SiteSearchTextField: FunctionComponent<Props> = ({
  onSearch,
  onClearSearch,
  onSearchTextChanged,
  value,
}) => {
  const onSearchKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClearSearch();
      }
    },
    [onClearSearch]
  );
  const onSearchKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        onSearch(event);
      }
      if (event.key === "Escape") {
        onClearSearch();
      }
    },
    [onSearch, onClearSearch]
  );

  return (
    <Flex>
      <Localized
        id="site-search-textField"
        attrs={{ "aria-label": true, placeholder: true }}
      >
        <TextField
          color="regular"
          className={styles.textField}
          data-testid="site-search-textField"
          placeholder="Search by site name"
          aria-label="Search by site name"
          onChange={onSearchTextChanged}
          onKeyPress={onSearchKeyPress}
          onKeyDown={onSearchKeyDown}
          variant="seamlessAdornment"
          value={value}
          adornment={
            <Localized
              id="site-search-searchButton"
              attrs={{ "aria-label": true }}
            >
              <Button
                data-testid="site-search-button"
                type="submit"
                color="dark"
                adornmentRight
                aria-label="Search"
                onClick={onSearch}
              >
                <Icon size="md">search</Icon>
              </Button>
            </Localized>
          }
        />
      </Localized>
    </Flex>
  );
};

export default SiteSearchTextField;
