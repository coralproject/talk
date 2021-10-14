import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { FieldSet, HorizontalGutter, Label } from "coral-ui/components/v2";

import SiteSearch, {
  SiteFilterOption,
} from "coral-admin/components/SiteSearch";

import { RelayPaginationProp } from "react-relay";

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

const SiteFilter: FunctionComponent<Props> = ({
  siteID,
  sites,
  onSelect,
  onLoadMore,
  hasMore,
  disableLoadMore,
  loading,
  relay,
}) => {
  return (
    <FieldSet>
      <HorizontalGutter spacing={2}>
        <Localized id="stories-filter-sites">
          <Label>Site</Label>
        </Localized>
        <SiteSearch
          sites={sites}
          siteID={siteID}
          onSelect={onSelect}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          disableLoadMore={disableLoadMore}
          loading={loading}
          relay={relay}
        />
      </HorizontalGutter>
    </FieldSet>
  );
};

export default SiteFilter;
