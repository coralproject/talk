import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import UserBoxContainer from "coral-stream/common/UserBox";
import { HorizontalGutter } from "coral-ui/components";

import ConfigureStreamContainer from "./ConfigureStream";
import HorizontalRule from "./HorizontalRule";
import ModerateStreamContainer from "./ModerateStreamContainer";
import OpenOrCloseStreamContainer from "./OpenOrCloseStream";

export interface Props {
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"] &
    PropTypesOf<typeof ModerateStreamContainer>["settings"];
  story: PropTypesOf<typeof ConfigureStreamContainer>["story"] &
    PropTypesOf<typeof OpenOrCloseStreamContainer>["story"] &
    PropTypesOf<typeof ModerateStreamContainer>["story"];
}

const Configure: FunctionComponent<Props> = props => {
  return (
    <div>
      <HorizontalGutter size="double">
        <UserBoxContainer viewer={props.viewer} settings={props.settings} />
        <ModerateStreamContainer
          settings={props.settings}
          story={props.story}
        />
        <HorizontalRule />
        <ConfigureStreamContainer story={props.story} />
        <HorizontalRule />
        <OpenOrCloseStreamContainer story={props.story} />
      </HorizontalGutter>
    </div>
  );
};

export default Configure;
