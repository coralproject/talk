import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import { HorizontalGutter } from "talk-ui/components";

import ConfigureCommentStreamContainer from "../containers/ConfigureCommentStreamContainer";

export interface Props {
  me: PropTypesOf<typeof UserBoxContainer>["me"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"];
  story: PropTypesOf<typeof ConfigureCommentStreamContainer>["story"];
}

const Configure: StatelessComponent<Props> = props => {
  return (
    <HorizontalGutter size="double">
      <UserBoxContainer me={props.me} settings={props.settings} />
      <ConfigureCommentStreamContainer story={props.story} />
    </HorizontalGutter>
  );
};

export default Configure;
