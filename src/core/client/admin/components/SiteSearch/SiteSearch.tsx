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
  siteID: string | null;
  onSelect: (id: string | null) => void;
}

const SiteSearch: FunctionComponent<Props> = ({ siteID, onSelect }) => {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [tempSearchFilter, setTempSearchFilter] = useState<string>("");
  const [isSiteSearchListVisible, setIsSiteSearchListVisible] = useState<
    boolean
  >(false);

  const onSearch = useCallback(() => {
    setSearchFilter(tempSearchFilter);
    setIsSiteSearchListVisible(true);
  }, [tempSearchFilter, setSearchFilter, setIsSiteSearchListVisible]);

  const onClearSearch = useCallback(() => {
    setSearchFilter("");
  }, [setSearchFilter]);

  const onSearchTextChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempSearchFilter(event.target.value);
    },
    [setTempSearchFilter]
  );

  const onSelectSite = useCallback(
    (
      site: SiteSearchListContainer_query["sites"]["edges"][0]["node"] | null
    ) => {
      onSelect(site ? site.id : null);
      setSearchFilter(site ? site.name : "");
      setIsSiteSearchListVisible(false);
    },
    [onSelect, setSearchFilter, setIsSiteSearchListVisible]
  );

  useEffect(() => {
    setTempSearchFilter(searchFilter);
  }, [searchFilter]);

  return (
    <FieldSet>
      <HorizontalGutter spacing={2}>
        <Localized id="stories-filter-sites">
          <Label>Site</Label>
        </Localized>
        <SiteSearchTextField
          onSearch={onSearch}
          value={tempSearchFilter}
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
                siteID={siteID}
                searchFilter={searchFilter}
              />
            </div>
          </ClickOutside>
        )}
      </HorizontalGutter>
    </FieldSet>
  );
};

export default SiteSearch;
