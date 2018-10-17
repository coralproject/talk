import * as React from "react";
import { StatelessComponent } from "react";
import { PropTypesOf } from "talk-framework/types";
import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import { HorizontalGutter } from "talk-ui/components";
import CommentHistoryContainer from "../containers/CommentHistoryContainer";

export interface ProfileProps {
  asset: PropTypesOf<typeof CommentHistoryContainer>["asset"];
  me: PropTypesOf<typeof UserBoxContainer>["me"] &
    PropTypesOf<typeof CommentHistoryContainer>["me"];
}

const Profile: StatelessComponent<ProfileProps> = props => {
  return (
    <HorizontalGutter size="double">
      <UserBoxContainer me={props.me} />
      {props.me && (
        <CommentHistoryContainer me={props.me} asset={props.asset} />
      )}
    </HorizontalGutter>
  );
};

export default Profile;
