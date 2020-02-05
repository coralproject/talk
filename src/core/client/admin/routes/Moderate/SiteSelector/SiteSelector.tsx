import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import getModerationLink, {
  QUEUE_NAME,
} from "coral-admin/helpers/getModerationLink";
import { PropTypesOf } from "coral-framework/types";
import { PaginatedSelect } from "coral-ui/components/v2";

import SiteSelectorSelected from "./SiteSelectorSelected";
import SiteSelectorSite from "./SiteSelectorSite";

import styles from "./SiteSelector.css";

interface Props {
  sites: Array<{ id: string } & PropTypesOf<typeof SiteSelectorSite>["site"]>;
  site: PropTypesOf<typeof SiteSelectorSelected>["site"] | null;
  queueName: string;
  siteID?: string;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const SiteSelector: FunctionComponent<Props> = ({
  sites,
  site,
  queueName,
  siteID,
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
          link={getModerationLink(queueName as QUEUE_NAME, null, null)}
          site={null}
          active={!siteID}
        />
        {sites.map(s => (
          <SiteSelectorSite
            link={getModerationLink(queueName as QUEUE_NAME, null, s.id)}
            key={s.id}
            site={s}
            active={siteID ? siteID === s.id : false}
          />
        ))}
      </>
    </PaginatedSelect>
  );
};

export default SiteSelector;
