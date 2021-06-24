import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import PaginatedSelect from "coral-admin/components/PaginatedSelect";
import { getModerationLink, QUEUE_NAME } from "coral-framework/helpers";
import { PropTypesOf } from "coral-framework/types";

import SiteSelectorCurrentSiteQuery from "./SiteSelectorCurrentSiteQuery";
import SiteSelectorSite from "./SiteSelectorSite";

import styles from "./SiteSelector.css";

interface Props {
  scoped: boolean;
  sites: ReadonlyArray<
    { id: string } & PropTypesOf<typeof SiteSelectorSite>["site"]
  >;
  queueName: QUEUE_NAME | undefined;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
  siteID: string | null;
}

const SiteSelector: FunctionComponent<Props> = ({
  sites,
  scoped,
  queueName,
  loading,
  onLoadMore,
  disableLoadMore,
  hasMore,
  siteID,
}) => {
  return (
    <PaginatedSelect
      icon="web_asset"
      loading={loading}
      onLoadMore={onLoadMore}
      disableLoadMore={disableLoadMore}
      hasMore={hasMore}
      className={styles.button}
      selected={
        <>
          {siteID && <SiteSelectorCurrentSiteQuery siteID={siteID} />}
          {!scoped && !siteID && (
            <Localized id="site-selector-all-sites">
              <span className={styles.buttonText}>All sites</span>
            </Localized>
          )}
        </>
      }
    >
      <>
        {!scoped && (
          <SiteSelectorSite
            link={getModerationLink({ queue: queueName })}
            site={null}
            active={!siteID}
          />
        )}
        {sites.map((s) => (
          <SiteSelectorSite
            link={getModerationLink({
              queue: queueName,
              siteID: s.id,
            })}
            key={s.id}
            site={s}
            active={(siteID && siteID === s.id) || false}
          />
        ))}
      </>
    </PaginatedSelect>
  );
};

export default SiteSelector;
