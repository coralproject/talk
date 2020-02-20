import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import PaginatedSelect from "coral-admin/components/PaginatedSelect";
import { PropTypesOf } from "coral-framework/types";
import { FieldSet, HorizontalGutter, Label } from "coral-ui/components/v2";

import SiteFilterOption from "./SiteFilterOption";
import SiteFilterSelected from "./SiteFilterSelected";

import styles from "./SiteFilter.css";

interface Props {
  sites: Array<
    { id: string } & PropTypesOf<typeof SiteFilterOption>["site"] &
      PropTypesOf<typeof SiteFilterSelected>["site"]
  >;
  siteID: string | null;
  onSelect: (id: string | null) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const SiteFilter: FunctionComponent<Props> = ({
  siteID,
  sites,
  onSelect,
  onLoadMore,
  hasMore,
  disableLoadMore,
  loading,
}) => {
  const selected = sites.find(s => s.id === siteID);
  return (
    <FieldSet>
      <HorizontalGutter spacing={2}>
        <Localized id="stories-filter-sites">
          <Label>Site</Label>
        </Localized>
        <PaginatedSelect
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          disableLoadMore={disableLoadMore}
          className={styles.root}
          loading={loading}
          selected={
            <>
              {selected ? (
                <SiteFilterSelected site={selected} />
              ) : (
                <Localized id="sites-filter-sites-allSites">
                  <span className={styles.buttonText}>All sites</span>
                </Localized>
              )}
            </>
          }
        >
          <SiteFilterOption
            onSelect={() => onSelect(null)}
            site={null}
            active={!siteID}
          />
          {sites.map(s => (
            <SiteFilterOption
              onSelect={id => onSelect(id)}
              site={s}
              active={s.id === siteID}
              key={s.id}
            />
          ))}
        </PaginatedSelect>
      </HorizontalGutter>
    </FieldSet>
  );
};

export default SiteFilter;
