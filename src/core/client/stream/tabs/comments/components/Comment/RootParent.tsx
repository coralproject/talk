import React, { StatelessComponent } from "react";

import Timestamp from "talk-stream/components/Timestamp";
import { Flex } from "talk-ui/components";

import StaffBadge from "./StaffBadge";
import TopBarLeft from "./TopBarLeft";
import Username from "./Username";

export interface RootParentProps {
  id?: string;
  username: string | null;
  createdAt: string;
  staff: boolean;
}

const RootParent: StatelessComponent<RootParentProps> = props => {
  return (
    <Flex direction="row" justifyContent="space-between" id={props.id}>
      <TopBarLeft>
        <Flex direction="row" alignItems="center" itemGutter="half">
          {props.username && <Username>{props.username}</Username>}
          {props.staff && <StaffBadge>Staff</StaffBadge>}
        </Flex>
        <Flex direction="row" alignItems="baseline" itemGutter>
          <Timestamp>{props.createdAt}</Timestamp>
        </Flex>
      </TopBarLeft>
    </Flex>
  );
};

export default RootParent;
