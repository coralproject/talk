import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./UserStatus.css";

interface Props {
  banned: boolean;
  bannedSiteCount?: number | null;
  moderationScopesEnabled: boolean;

  suspended: boolean;
  premod: boolean;
  warned: boolean;
}

const render = (className: string, content: React.ReactNode) => (
  <div className={cn(styles.root, className)}>
    <Flex alignItems="center" itemGutter="half">
      {content}
    </Flex>
  </div>
);

const UserStatus: FunctionComponent<Props> = (props) => {
  if (props.moderationScopesEnabled && props.banned) {
    return render(
      styles.error,
      <Localized id="userStatus-banned-all">
        <div>Banned (all)</div>
      </Localized>
    );
  }
  if (
    props.moderationScopesEnabled &&
    props.bannedSiteCount &&
    props.bannedSiteCount > 0
  ) {
    return render(
      styles.error,
      <Localized
        id="userStatus-banned-count"
        vars={{ count: props.bannedSiteCount }}
      >
        <div>Banned ({props.bannedSiteCount})</div>
      </Localized>
    );
  }
  if (props.banned) {
    return render(
      styles.error,
      <Localized id="userStatus-banned">
        <div>Banned</div>
      </Localized>
    );
  }
  if (props.suspended) {
    return render(
      styles.warning,
      <Localized id="userStatus-suspended">
        <div>Suspended</div>
      </Localized>
    );
  }
  if (props.premod) {
    return render(
      styles.warning,
      <Localized id="userStatus-premod">
        <div>Always Premoderated</div>
      </Localized>
    );
  }
  if (props.warned) {
    return render(
      styles.warning,
      <Localized id="userStatus-warned">
        <div>Warned</div>
      </Localized>
    );
  }
  return render(
    styles.success,
    <Localized id="userStatus-active">
      <div>Active</div>
    </Localized>
  );
};

export default UserStatus;
