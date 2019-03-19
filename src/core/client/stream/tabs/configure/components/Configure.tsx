import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import { HorizontalGutter } from "talk-ui/components";

import ConfigureStreamContainer from "../containers/ConfigureStreamContainer";
import OpenOrCloseStreamContainer from "../containers/OpenOrCloseStreamContainer";
import HorizontalRule from "./HorizontalRule";

export interface Props {
  me: PropTypesOf<typeof UserBoxContainer>["me"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"];
  story: PropTypesOf<typeof ConfigureStreamContainer>["story"] &
    PropTypesOf<typeof OpenOrCloseStreamContainer>["story"];
}

const Configure: StatelessComponent<Props> = props => {
  return (
    <div>
      <HorizontalGutter size="double">
        <UserBoxContainer me={props.me} settings={props.settings} />
        <ConfigureStreamContainer story={props.story} />
      </HorizontalGutter>
      <HorizontalRule />
      <OpenOrCloseStreamContainer story={props.story} />
    </div>
  );
};

export default Configure;
