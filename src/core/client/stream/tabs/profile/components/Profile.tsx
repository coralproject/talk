import * as React from "react";
import { StatelessComponent } from "react";
import { PropTypesOf } from "talk-framework/types";
import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import { HorizontalGutter } from "talk-ui/components";
import CommentHistoryContainer from "../containers/CommentHistoryContainer";

export interface ProfileProps {
  story: PropTypesOf<typeof CommentHistoryContainer>["story"];
  me: PropTypesOf<typeof UserBoxContainer>["me"] &
    PropTypesOf<typeof CommentHistoryContainer>["me"];
}

const Profile: StatelessComponent<ProfileProps> = props => {
  return (
    <HorizontalGutter size="double">
      <UserBoxContainer me={props.me} />
      <CommentHistoryContainer me={props.me} story={props.story} />
    </HorizontalGutter>
  );
};

export default Profile;
