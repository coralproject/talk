import React, { FunctionComponent, useEffect, useState } from "react";

import { PropTypesOf } from "coral-framework/types";

import SiteSearchList from "./SiteSearchList";
import SiteSearchTextField from "./SiteSearchTextField";
import SiteFilterOption from "./SiteFilterOption";

import { useRefetch } from "coral-framework/lib/relay";
import { SiteFilterContainerPaginationQueryVariables } from "coral-admin/__generated__/SiteFilterContainerPaginationQuery.graphql";
import { RelayPaginationProp } from "react-relay";
import { ClickOutside } from "coral-ui/components/v2";

interface Props {
  sites: Array<{ id: string } & PropTypesOf<typeof SiteFilterOption>["site"]>;
  siteID: string | null;
  onSelect: (id: string | null) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
  relay: RelayPaginationProp;
}

const SiteSearch: FunctionComponent<Props> = ({
  sites,
  siteID,
  onSelect,
  onLoadMore,
  hasMore,
  disableLoadMore,
  loading,
  relay,
}) => {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [tempSearchFilter, setTempSearchFilter] = useState<string>("");
  const [isSiteSearchListVisible, setIsSiteSearchListVisible] = useState<
    boolean
  >(false);

  useRefetch<Pick<SiteFilterContainerPaginationQueryVariables, "searchFilter">>(
    relay,
    10,
    {
      searchFilter,
    }
  );

  useEffect(() => {
    setTempSearchFilter(searchFilter);
  }, [searchFilter]);

  const onSiteFilterOptionSelect = (id: string | null) => {
    onSelect(id);
    setIsSiteSearchListVisible(false);
  };

  return (
    <>
      <SiteSearchTextField
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        tempSearchFilter={tempSearchFilter}
        setTempSearchFilter={setTempSearchFilter}
        setIsSiteSearchListVisible={setIsSiteSearchListVisible}
      />
      <ClickOutside onClickOutside={() => setIsSiteSearchListVisible(false)}>
        <div>
          <SiteSearchList
            isVisible={isSiteSearchListVisible}
            sites={sites}
            loading={loading}
            hasMore={hasMore}
            disableLoadMore={disableLoadMore}
            onLoadMore={onLoadMore}
          >
            {/* NOTE: In future, can render this based on a kind passed through for filter button, moderation link, etc. */}
            <SiteFilterOption
              onSelect={onSiteFilterOptionSelect}
              setSearchFilter={setSearchFilter}
              site={null}
              active={!siteID}
            />
            {sites.map((s) => (
              <SiteFilterOption
                onSelect={(id) => onSiteFilterOptionSelect(id)}
                setSearchFilter={setSearchFilter}
                site={s}
                active={s.id === siteID}
                key={s.id}
              />
            ))}
          </SiteSearchList>
        </div>
      </ClickOutside>
    </>
  );
};

export default SiteSearch;
