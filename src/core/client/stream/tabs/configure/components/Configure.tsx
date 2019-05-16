import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import UserBoxContainer from "coral-stream/containers/UserBoxContainer";
import { HorizontalGutter } from "coral-ui/components";

import ConfigureStreamContainer from "../containers/ConfigureStreamContainer";
import OpenOrCloseStreamContainer from "../containers/OpenOrCloseStreamContainer";
import HorizontalRule from "./HorizontalRule";

export interface Props {
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"];
  story: PropTypesOf<typeof ConfigureStreamContainer>["story"] &
    PropTypesOf<typeof OpenOrCloseStreamContainer>["story"];
}

const Configure: FunctionComponent<Props> = props => {
  return (
    <div>
      <HorizontalGutter size="double">
        <UserBoxContainer viewer={props.viewer} settings={props.settings} />
        <ConfigureStreamContainer story={props.story} />
      </HorizontalGutter>
      <HorizontalRule />
      <OpenOrCloseStreamContainer story={props.story} />
    </div>
  );
};

export default Configure;
