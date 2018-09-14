import * as React from "react";
import { StatelessComponent } from "react";
import { PropTypesOf } from "talk-framework/types";
import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import { HorizontalGutter } from "talk-ui/components";
import CommentsHistoryContainer from "../containers/CommentsHistoryContainer";

export interface ProfileProps {
  me:
    | PropTypesOf<typeof UserBoxContainer>["me"] &
        PropTypesOf<typeof CommentsHistoryContainer>["me"]
    | null;
}

const Profile: StatelessComponent<ProfileProps> = props => {
  return (
    <HorizontalGutter size="double">
      <UserBoxContainer me={props.me} />
      {props.me && <CommentsHistoryContainer me={props.me} />}
    </HorizontalGutter>
  );
};

export default Profile;
