import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components";

import ClosedStreamMessageConfigContainer from "./ClosedStreamMessageConfigContainer";
import ClosingCommentStreamsConfigContainer from "./ClosingCommentStreamsConfigContainer";
import CommentEditingConfigContainer from "./CommentEditingConfigContainer";
import CommentLengthConfigContainer from "./CommentLengthConfigContainer";
import EmbedCodeContainer from "./EmbedCodeContainer";
import GuidelinesConfigContainer from "./GuidelinesConfigContainer";
import SitewideCommentingConfigContainer from "./SitewideCommentingConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof GuidelinesConfigContainer>["settings"] &
    PropTypesOf<typeof CommentLengthConfigContainer>["settings"] &
    PropTypesOf<typeof CommentEditingConfigContainer>["settings"] &
    PropTypesOf<typeof ClosedStreamMessageConfigContainer>["settings"] &
    PropTypesOf<typeof ClosingCommentStreamsConfigContainer>["settings"] &
    PropTypesOf<typeof EmbedCodeContainer>["settings"] &
    PropTypesOf<typeof SitewideCommentingConfigContainer>["settings"];
  onInitValues: (values: any) => void;
}

const General: FunctionComponent<Props> = ({
  disabled,
  settings,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-generalContainer">
    <EmbedCodeContainer settings={settings} />
    <SitewideCommentingConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
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
