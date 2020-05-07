import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import UserBoxContainer from "coral-stream/common/UserBox";
import { HorizontalRule } from "coral-ui/components/v2";

import ModerateStreamContainer from "../../common/ModerateStream/ModerateStreamContainer";
import { AddMessageContainer } from "./AddMessage";
import ConfigureStreamContainer from "./ConfigureStream";
import { LiveUpdatesConfigContainer } from "./LiveUpdatesConfig";
import OpenOrCloseStreamContainer from "./OpenOrCloseStream";
import { QAConfigContainer } from "./Q&A";

export interface Props {
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"] &
    PropTypesOf<typeof ModerateStreamContainer>["settings"] &
    PropTypesOf<typeof QAConfigContainer>["settings"];
  story: PropTypesOf<typeof ConfigureStreamContainer>["story"] &
    PropTypesOf<typeof OpenOrCloseStreamContainer>["story"] &
    PropTypesOf<typeof ModerateStreamContainer>["story"] &
    PropTypesOf<typeof QAConfigContainer>["story"] &
    PropTypesOf<typeof LiveUpdatesConfigContainer>["story"] &
    PropTypesOf<typeof AddMessageContainer>["story"];
}

const Configure: FunctionComponent<Props> = (props) => {
  return (
    <div>
      <UserBoxContainer viewer={props.viewer} settings={props.settings} />
      <ConfigureStreamContainer story={props.story} />
      <HorizontalRule />
      <AddMessageContainer story={props.story} />
      <QAConfigContainer story={props.story} settings={props.settings} />
      <HorizontalRule />
      <LiveUpdatesConfigContainer story={props.story} />
      <HorizontalRule />
      <OpenOrCloseStreamContainer story={props.story} />
    </div>
  );
};

export default Configure;
