import { useLocal } from "coral-framework/lib/relay";
import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import { LiveBellIconLocal } from "coral-stream/__generated__/LiveBellIconLocal.graphql";

interface Props {
  userID?: string;
}

export const LiveBellIcon: FunctionComponent<Props> = () => {
  const [{ notificationCount }] = useLocal<LiveBellIconLocal>(graphql`
    fragment LiveBellIconLocal on Local {
      notificationCount
    }
  `);

  return <div>{notificationCount ?? 0}</div>;
};
