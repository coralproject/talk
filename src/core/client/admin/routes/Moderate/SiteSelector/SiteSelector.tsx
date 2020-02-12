import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import PaginatedSelect from "coral-admin/components/PaginatedSelect";
import { getModerationLink, QUEUE_NAME } from "coral-framework/helpers";
import { PropTypesOf } from "coral-framework/types";

import SiteSelectorSelected from "./SiteSelectorSelected";
import SiteSelectorSite from "./SiteSelectorSite";

import styles from "./SiteSelector.css";

interface Props {
  sites: Array<{ id: string } & PropTypesOf<typeof SiteSelectorSite>["site"]>;
  site:
    | { id: string } & PropTypesOf<typeof SiteSelectorSelected>["site"]
    | null;
  queueName: string;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const SiteSelector: FunctionComponent<Props> = ({
  sites,
  site,
  queueName,
  loading,
  onLoadMore,
  disableLoadMore,
  hasMore,
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
          {site && <SiteSelectorSelected site={site} />}

          {!site && (
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
          active={!site}
        />
        {sites.map(s => (
          <SiteSelectorSite
            link={getModerationLink({
              queue: queueName as QUEUE_NAME,
              siteID: s.id,
            })}
            key={s.id}
            site={s}
            active={(site && site.id === s.id) || false}
          />
        ))}
      </>
    </PaginatedSelect>
  );
};

export default SiteSelector;
