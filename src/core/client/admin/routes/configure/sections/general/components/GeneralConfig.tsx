import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { HorizontalGutter } from "talk-ui/components";

import ClosedStreamMessageConfigContainer from "../containers/ClosedStreamMessageConfigContainer";
import ClosingCommentStreamsConfigContainer from "../containers/ClosingCommentStreamsConfigContainer";
import CommentEditingConfigContainer from "../containers/CommentEditingConfigContainer";
import CommentLengthConfigContainer from "../containers/CommentLengthConfigContainer";
import GuidelinesConfigContainer from "../containers/GuidelinesConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof GuidelinesConfigContainer>["settings"] &
    PropTypesOf<typeof CommentLengthConfigContainer>["settings"] &
    PropTypesOf<typeof CommentEditingConfigContainer>["settings"] &
    PropTypesOf<typeof ClosedStreamMessageConfigContainer>["settings"] &
    PropTypesOf<typeof ClosingCommentStreamsConfigContainer>["settings"];
  onInitValues: (values: any) => void;
}

const General: StatelessComponent<Props> = ({
  disabled,
  settings,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-generalContainer">
    <GuidelinesConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <CommentLengthConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <CommentEditingConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <ClosingCommentStreamsConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <ClosedStreamMessageConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default General;
