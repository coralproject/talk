import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import PaginatedSelect from "coral-admin/components/PaginatedSelect";
import { getModerationLink, QUEUE_NAME } from "coral-framework/helpers";
import { PropTypesOf } from "coral-framework/types";

import SiteSelectorCurrentSiteQuery from "./SiteSelectorCurrentSiteQuery";
import SiteSelectorSite from "./SiteSelectorSite";

import styles from "./SiteSelector.css";

interface Props {
  sites: Array<{ id: string } & PropTypesOf<typeof SiteSelectorSite>["site"]>;
  queueName: string;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
  siteID: string | null;
}

const SiteSelector: FunctionComponent<Props> = ({
  sites,
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

          {!siteID && (
            <Localized id="site-selector-all-sites">
              <span className={styles.buttonText}>All sites</span>
            </Localized>
          )}
        </>
      }
    >
      <>
        <SiteSelectorSite
          link={getModerationLink({ queue: queueName as QUEUE_NAME })}
          site={null}
          active={!siteID}
        />
        {sites.map(s => (
          <SiteSelectorSite
            link={getModerationLink({
              queue: queueName as QUEUE_NAME,
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
