import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Markdown } from "coral-framework/components";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { HorizontalGutter, Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import MessageBoxContainer from "../MessageBoxContainer";

interface Props {
  message: string;
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
}
const PostCommentFormClosedSitewide: FunctionComponent<Props> = (props) => (
  <HorizontalGutter size="double">
    <CallOut
      color="mono"
      icon={<Icon size="sm">feedback</Icon>}
      className={cn(CLASSES.createComment.closed)}
      title={<Markdown>{props.message}</Markdown>}
    />
    {props.showMessageBox && (
      <div className={CLASSES.createComment.$root}>
        <MessageBoxContainer
          story={props.story}
          className={CLASSES.createComment.message}
        />
      </div>
    )}
  </HorizontalGutter>
);

export default PostCommentFormClosedSitewide;
