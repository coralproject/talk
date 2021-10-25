import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";

import {
  ClickOutside,
  FieldSet,
  HorizontalGutter,
  Label,
} from "coral-ui/components/v2";

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
          setSearchFilter={setSearchFilter}
          tempSearchFilter={tempSearchFilter}
          setTempSearchFilter={setTempSearchFilter}
          setIsSiteSearchListVisible={setIsSiteSearchListVisible}
        />
        {isSiteSearchListVisible && (
          <ClickOutside
            onClickOutside={() => setIsSiteSearchListVisible(false)}
          >
            <div>
              <SiteSearchListQuery
                onSelect={onSelect}
                siteID={siteID}
                setIsSiteSearchListVisible={setIsSiteSearchListVisible}
                setSearchFilter={setSearchFilter}
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
