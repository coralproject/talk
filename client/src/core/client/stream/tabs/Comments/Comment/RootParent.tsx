import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import Timestamp from "coral-stream/common/Timestamp";
import { Flex } from "coral-ui/components/v2";

import TopBarLeft from "./TopBarLeft";
import Username from "./Username";

export interface RootParentProps {
  id?: string;
  username: string | null;
  createdAt: string;
  tags: React.ReactNode;
}

const RootParent: FunctionComponent<RootParentProps> = (props) => {
  return (
    <Flex
      className={CLASSES.conversationThread.rootParent.$root}
      direction="row"
      justifyContent="space-between"
      id={props.id}
    >
      <TopBarLeft>
        <Flex direction="row" alignItems="center" itemGutter="half">
          <div>
            {props.username && (
              <Username
                className={CLASSES.conversationThread.rootParent.username}
              >
                {props.username}
              </Username>
            )}
          </div>
          {props.tags}
        </Flex>
        <Flex direction="row" alignItems="baseline" itemGutter>
          <Timestamp
            className={CLASSES.conversationThread.rootParent.timestamp}
          >
            {props.createdAt}
          </Timestamp>
        </Flex>
      </TopBarLeft>
    </Flex>
  );
};

export default RootParent;
