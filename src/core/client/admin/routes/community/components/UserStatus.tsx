import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Flex, Typography } from "talk-ui/components";
import { PropTypesOf } from "talk-ui/types";

import styles from "./UserStatus.css";

interface Props {
  banned: boolean;
  suspended: boolean;
}

const render = (
  color: PropTypesOf<typeof Typography>["color"],
  content: React.ReactNode
) => (
  <Typography color={color} variant="detail" container="div">
    <Flex alignItems="center" itemGutter="half">
      <div aria-hidden className={styles.dot}>
        •
      </div>
      {content}
    </Flex>
  </Typography>
);

const UserStatus: StatelessComponent<Props> = props => {
  if (props.banned) {
    return render(
      "error",
      // tslint:disable-next-line:jsx-wrap-multiline
      <Localized id="userStatus-banned">
        <div>Banned</div>
      </Localized>
    );
  }
  if (props.suspended) {
    return render(
      "warning",
      // tslint:disable-next-line:jsx-wrap-multiline
      <Localized id="userStatus-suspended">
        <div>Suspended</div>
      </Localized>
    );
  }
  return render(
    "success",
    // tslint:disable-next-line:jsx-wrap-multiline
    <Localized id="userStatus-active">
      <div>Active</div>
    </Localized>
  );
};

export default UserStatus;
