import { PropTypesOf } from "coral-framework/types";
import UserBoxContainer from "coral-stream/containers/UserBoxContainer";
import { HorizontalGutter } from "coral-ui/components";
import * as React from "react";
import { FunctionComponent } from "react";
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
