import React, { FunctionComponent } from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import getModerationLink, {
  QUEUE_NAME,
} from "coral-admin/helpers/getModerationLink";
import { PropTypesOf } from "coral-framework/types";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  Flex,
  Popover,
  Spinner,
} from "coral-ui/components/v2";

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
    <Popover
      id="sitesMenu"
      placement="bottom-end"
      modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Dropdown className={styles.dropdown}>
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
            {loading && (
              <Flex justifyContent="center">
                <Spinner />
              </Flex>
            )}
            {hasMore && (
              <Flex justifyContent="center">
                <AutoLoadMore
                  disableLoadMore={disableLoadMore}
                  onLoadMore={onLoadMore}
                />
              </Flex>
            )}
          </Dropdown>
        </ClickOutside>
      )}
    >
      {({ toggleVisibility, ref, visible }) => (
        <Button
          className={styles.button}
          variant="flat"
          adornmentLeft
          color="mono"
          onClick={toggleVisibility}
          ref={ref}
          uppercase={false}
        >
          <ButtonIcon className={styles.buttonIconLeft}>web_asset</ButtonIcon>
          <Flex alignItems="center" className={styles.wrapper}>
            {site && <SiteSelectorSelected site={site} />}
            {!siteID && <span className={styles.buttonText}>All sites</span>}
          </Flex>
          <ButtonIcon className={styles.buttonIconRight}>
            keyboard_arrow_down
          </ButtonIcon>
        </Button>
      )}
    </Popover>
  );
};

export default SiteSelector;
