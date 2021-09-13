import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import UserBoxContainer from "coral-stream/common/UserBox";
import { HorizontalRule } from "coral-ui/components/v2";

import ModerateStreamContainer from "../../common/ModerateStream/ModerateStreamContainer";
import { AddMessageContainer } from "./AddMessage";
import ArchivedConfigurationContainer from "./ArchivedConfigurationContainer";
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
    PropTypesOf<typeof AddMessageContainer>["story"] &
    PropTypesOf<typeof ArchivedConfigurationContainer>["story"];
  isArchived: boolean;
  isArchiving: boolean;
}

const Configure: FunctionComponent<Props> = ({
  viewer,
  settings,
  story,
  isArchived,
  isArchiving,
}) => {
  if (isArchiving) {
    return null;
  }

  if (isArchived) {
    return (
      <div>
        <UserBoxContainer viewer={viewer} settings={settings} />
        <ArchivedConfigurationContainer story={story} />
      </div>
    );
  }

  return (
    <div>
      <UserBoxContainer viewer={viewer} settings={settings} />
      <ConfigureStreamContainer story={story} />
      <HorizontalRule />
      <AddMessageContainer story={story} />
      <QAConfigContainer story={story} settings={settings} />
      <HorizontalRule />
      <LiveUpdatesConfigContainer story={story} />
      <HorizontalRule />
      <OpenOrCloseStreamContainer story={story} />
    </div>
  );
};

export default Configure;
