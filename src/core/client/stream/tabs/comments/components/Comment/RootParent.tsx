import React, { StatelessComponent } from "react";

import Timestamp from "talk-stream/components/Timestamp";
import { Flex } from "talk-ui/components";

import TopBarLeft from "./TopBarLeft";
import Username from "./Username";

export interface RootParentProps {
  id?: string;
  username: string | null;
  createdAt: string;
}

const RootParent: StatelessComponent<RootParentProps> = props => {
  return (
    <Flex direction="row" justifyContent="space-between" id={props.id}>
      <TopBarLeft>
        {props.username && <Username>{props.username}</Username>}
        <Flex direction="row" alignItems="baseline" itemGutter>
          <Timestamp>{props.createdAt}</Timestamp>
        </Flex>
      </TopBarLeft>
    </Flex>
  );
};

export default RootParent;
