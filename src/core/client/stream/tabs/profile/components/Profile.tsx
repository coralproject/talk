import * as React from "react";
import { StatelessComponent } from "react";
import { PropTypesOf } from "talk-framework/types";
import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import { HorizontalGutter } from "talk-ui/components";

export interface ProfileProps {
  me: PropTypesOf<typeof UserBoxContainer>["me"] | null;
}

const Profile: StatelessComponent<ProfileProps> = props => {
  return (
    <HorizontalGutter size="double">
      <HorizontalGutter size="half">
        <UserBoxContainer me={props.me} />
      </HorizontalGutter>
    </HorizontalGutter>
  );
};

export default Profile;
