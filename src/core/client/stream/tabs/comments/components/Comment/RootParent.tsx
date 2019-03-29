import React, { StatelessComponent } from "react";

import Timestamp from "talk-stream/components/Timestamp";
import { Flex, Tag } from "talk-ui/components";

import TopBarLeft from "./TopBarLeft";
import Username from "./Username";

export interface RootParentProps {
  id?: string;
  username: string | null;
  createdAt: string;
  tags?: ReadonlyArray<string>;
}

const RootParent: StatelessComponent<RootParentProps> = props => {
  return (
    <Flex direction="row" justifyContent="space-between" id={props.id}>
      <TopBarLeft>
        <Flex direction="row" alignItems="center" itemGutter="half">
          {props.username && <Username>{props.username}</Username>}
          {props.tags && props.tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
        </Flex>
        <Flex direction="row" alignItems="baseline" itemGutter>
          <Timestamp>{props.createdAt}</Timestamp>
        </Flex>
      </TopBarLeft>
    </Flex>
  );
};

export default RootParent;
