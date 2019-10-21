import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components";

import styles from "./UserStatus.css";

interface Props {
  banned: boolean;
  suspended: boolean;
  premod: boolean;
}

const render = (className: string, content: React.ReactNode) => (
  <div className={className}>
    <Flex alignItems="center" itemGutter="half">
      {content}
    </Flex>
  </div>
);

const UserStatus: FunctionComponent<Props> = props => {
  if (props.banned) {
    return render(
      styles.error,
      // tslint:disable-next-line:jsx-wrap-multiline
      <Localized id="userStatus-banned">
        <div>Banned</div>
      </Localized>
    );
  }
  if (props.suspended) {
    return render(
      styles.warning,
      // tslint:disable-next-line:jsx-wrap-multiline
      <Localized id="userStatus-suspended">
        <div>Suspended</div>
      </Localized>
    );
  }
  if (props.premod) {
    return render(
      styles.warning,
      // tslint:disable-next-line:jsx-wrap-multiline
      <Localized id="userStatus-premod">
        <div>Always Premoderated</div>
      </Localized>
    );
  }
  return render(
    styles.success,
    // tslint:disable-next-line:jsx-wrap-multiline
    <Localized id="userStatus-active">
      <div>Active</div>
    </Localized>
  );
};

export default UserStatus;
