import React, { FunctionComponent } from "react";

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
} from "coral-ui/components/v2";
import styles from "./SiteSelector.css";
import SiteSelectorSelected from "./SiteSelectorSelected";
import SiteSelectorSite from "./SiteSelectorSite";

interface Props {
  sites: Array<
    { id: string } & PropTypesOf<typeof SiteSelectorSite>["site"] &
      PropTypesOf<typeof SiteSelectorSelected>["site"]
  >;
  queueName: string;
  siteID?: string;
}

const SiteSelector: FunctionComponent<Props> = ({
  sites,
  queueName,
  siteID,
}) => {
  const selectedSite = sites.find(s => s.id === siteID);
  return (
    <Popover
      id="userMenu"
      placement="bottom-end"
      modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Dropdown className={styles.dropdown}>
            <SiteSelectorSite
              link={getModerationLink(queueName as QUEUE_NAME, null, null)}
              site={null}
            />
            {sites.map(s => (
              <SiteSelectorSite
                link={getModerationLink(queueName as QUEUE_NAME, null, s.id)}
                key={s.id}
                site={s}
                active={siteID ? siteID === s.id : false}
              />
            ))}
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
          <Flex alignItems="center" className={styles.wrapper}>
            <ButtonIcon className={styles.buttonIconLeft}>web_asset</ButtonIcon>
            {selectedSite && <SiteSelectorSelected site={selectedSite} />}
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
