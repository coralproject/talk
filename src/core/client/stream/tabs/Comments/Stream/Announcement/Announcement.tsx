import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { AlarmBellIcon, RemoveIcon, SvgIcon } from "coral-ui/components/icons";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./Announcement.css";

interface Props {
  children: string;
  onClose: () => void;
}

const Announcement: FunctionComponent<Props> = (props) => {
  return (
    <Localized
      id="comments-announcement-section"
      attrs={{ "aria-label": true }}
    >
      <section
        className={cn(styles.root, CLASSES.announcement)}
        aria-label="Announcement"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Flex itemGutter="double" alignItems="center">
            <div>
              <SvgIcon size="lg" Icon={AlarmBellIcon} />
            </div>
            <span className={styles.text}>{props.children}</span>
          </Flex>
          <div>
            <Localized
              id="comments-announcement-closeButton"
              attrs={{ "aria-label": true }}
            >
              <Button
                variant="none"
                color="none"
                onClick={props.onClose}
                className={styles.closeButton}
                aria-label="Close announcement"
              >
                <SvgIcon Icon={RemoveIcon} />
              </Button>
            </Localized>
          </div>
        </Flex>
      </section>
    </Localized>
  );
};

export default Announcement;
