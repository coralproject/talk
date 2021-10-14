import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useEffect } from "react";

import { Button, Flex, Icon, TextField } from "coral-ui/components/v2";

interface Props {
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  tempSearchFilter: string;
  setTempSearchFilter: (filter: string) => void;
  setIsSiteSearchListVisible: (isVisible: boolean) => void;
}

const SiteSearchTextField: FunctionComponent<Props> = ({
  searchFilter,
  setSearchFilter,
  tempSearchFilter,
  setTempSearchFilter,
  setIsSiteSearchListVisible,
}) => {
  const clearSearchFilter = useCallback(() => {
    setSearchFilter("");
  }, [setSearchFilter]);
  const onSubmitSearch = useCallback(() => {
    setSearchFilter(tempSearchFilter);
    setIsSiteSearchListVisible(true);
  }, [tempSearchFilter]);
  const onSearchTextChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempSearchFilter(event.target.value);
    },
    [setTempSearchFilter]
  );
  const onSearchKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        clearSearchFilter();
      }
    },
    [clearSearchFilter]
  );
  const onSearchKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        onSubmitSearch();
      }
      if (event.key === "Escape") {
        clearSearchFilter();
      }
    },
    [onSubmitSearch, clearSearchFilter]
  );

  useEffect(() => {
    setTempSearchFilter(searchFilter);
  }, [searchFilter]);

  return (
    <Flex>
      <Localized
        id="site-search-textField"
        attrs={{ "aria-label": true, placeholder: true }}
      >
        <TextField
          color="regular"
          data-testid="site-search-textField"
          placeholder="Search by site name"
          aria-label="Search by site name"
          onChange={onSearchTextChanged}
          onKeyPress={onSearchKeyPress}
          onKeyDown={onSearchKeyDown}
          variant="seamlessAdornment"
          value={tempSearchFilter}
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
                onClick={onSubmitSearch}
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
