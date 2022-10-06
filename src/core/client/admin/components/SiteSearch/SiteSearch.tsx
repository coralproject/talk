import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ClickOutside,
  FieldSet,
  HorizontalGutter,
  Label,
} from "coral-ui/components/v2";

import { SiteSearchListContainer_query } from "coral-admin/__generated__/SiteSearchListContainer_query.graphql";

import SiteSearchListQuery from "./SiteSearchListQuery";
import SiteSearchTextField from "./SiteSearchTextField";

interface Props {
  onSelect: (id: string | null) => void;
  showOnlyScopedSitesInSearchResults: boolean;
  showSiteSearchLabel: boolean;
  showAllSitesSearchFilterOption: boolean;
  clearTextFieldValueAfterSelect: boolean;
}

const SiteSearch: FunctionComponent<Props> = ({
  onSelect,
  showOnlyScopedSitesInSearchResults,
  showSiteSearchLabel,
  showAllSitesSearchFilterOption,
  clearTextFieldValueAfterSelect,
}) => {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [searchTextFieldValue, setSearchTextFieldValue] = useState<string>("");
  const [isSiteSearchListVisible, setIsSiteSearchListVisible] =
    useState<boolean>(false);
  const [activeSiteID, setActiveSiteID] = useState<string | null>(null);

  const onSearch = useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      setSearchFilter(searchTextFieldValue);
      setIsSiteSearchListVisible(true);
    },
    [searchTextFieldValue, setSearchFilter, setIsSiteSearchListVisible]
  );

  const onClearSearch = useCallback(() => {
    setSearchFilter("");
  }, [setSearchFilter]);

  const onSearchTextChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTextFieldValue(event.target.value);
    },
    [setSearchTextFieldValue]
  );

  const onSelectSite = useCallback(
    (
      site: SiteSearchListContainer_query["sites"]["edges"][0]["node"] | null
    ) => {
      onSelect(site ? site.id : null);
      if (clearTextFieldValueAfterSelect) {
        setSearchTextFieldValue("");
      } else {
        setSearchTextFieldValue(site ? site.name : "");
      }
      setActiveSiteID(site ? site.id : null);
      setIsSiteSearchListVisible(false);
    },
    [
      onSelect,
      setSearchTextFieldValue,
      setIsSiteSearchListVisible,
      clearTextFieldValueAfterSelect,
    ]
  );

  useEffect(() => {
    setSearchTextFieldValue(searchFilter);
  }, [searchFilter]);

  return (
    <FieldSet>
      <HorizontalGutter spacing={2}>
        {showSiteSearchLabel && (
          <Localized id="stories-filter-sites">
            <Label>Site</Label>
          </Localized>
        )}
        <SiteSearchTextField
          onSearch={onSearch}
          value={searchTextFieldValue}
          onClearSearch={onClearSearch}
          onSearchTextChanged={onSearchTextChanged}
        />
        {isSiteSearchListVisible && (
          <ClickOutside
            onClickOutside={() => setIsSiteSearchListVisible(false)}
          >
            <div>
              <SiteSearchListQuery
                onSelect={onSelectSite}
                searchFilter={searchFilter}
                activeSiteID={activeSiteID}
                showOnlyScopedSitesInSearchResults={
                  showOnlyScopedSitesInSearchResults
                }
                showAllSitesSearchFilterOption={showAllSitesSearchFilterOption}
              />
            </div>
          </ClickOutside>
        )}
      </HorizontalGutter>
    </FieldSet>
  );
};

export default SiteSearch;
