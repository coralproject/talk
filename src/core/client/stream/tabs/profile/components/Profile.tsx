import * as React from "react";
import { FunctionComponent } from "react";
import { PropTypesOf } from "talk-framework/types";
import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import { HorizontalGutter } from "talk-ui/components";
import CommentHistoryContainer from "../containers/CommentHistoryContainer";

export interface ProfileProps {
  story: PropTypesOf<typeof CommentHistoryContainer>["story"];
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"] &
    PropTypesOf<typeof CommentHistoryContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"];
}

const Profile: FunctionComponent<ProfileProps> = props => {
  return (
    <HorizontalGutter size="double">
      <UserBoxContainer viewer={props.viewer} settings={props.settings} />
      <CommentHistoryContainer viewer={props.viewer} story={props.story} />
    </HorizontalGutter>
  );
};

export default Profile;
