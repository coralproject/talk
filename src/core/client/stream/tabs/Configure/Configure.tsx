import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import UserBoxContainer from "coral-stream/common/UserBox";
import { HorizontalGutter } from "coral-ui/components/v2";

import ConfigureStreamContainer from "./ConfigureStream";
import HorizontalRule from "./HorizontalRule";
import ModerateStreamContainer from "./ModerateStreamContainer";
import OpenOrCloseStreamContainer from "./OpenOrCloseStream";

export interface Props {
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"];
  organization: PropTypesOf<typeof UserBoxContainer>["organization"] &
    PropTypesOf<typeof ModerateStreamContainer>["organization"];
  story: PropTypesOf<typeof ConfigureStreamContainer>["story"] &
    PropTypesOf<typeof OpenOrCloseStreamContainer>["story"] &
    PropTypesOf<typeof ModerateStreamContainer>["story"];
}

const Configure: FunctionComponent<Props> = props => {
  return (
    <div>
      <HorizontalGutter size="double">
        <UserBoxContainer
          viewer={props.viewer}
          organization={props.organization}
        />
        <ModerateStreamContainer
          organization={props.organization}
          story={props.story}
        />
        <HorizontalRule />
        <UserBoxContainer
          viewer={props.viewer}
          organization={props.organization}
        />
        <ConfigureStreamContainer story={props.story} />
        <HorizontalRule />
        <OpenOrCloseStreamContainer story={props.story} />
      </HorizontalGutter>
    </div>
  );
};

export default Configure;
