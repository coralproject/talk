import { Localized } from "@fluent/react/compat";
import React, { EventHandler, FunctionComponent, MouseEvent } from "react";

import { Button, Icon, MatchMedia } from "coral-ui/components/v2";

interface Props {
  id?: string;
  onClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

const ReplyButton: FunctionComponent<Props> = (props) => (
  <Localized id="comments-replyButton" attrs={{ "aria-label": true }}>
    <Button
      className={props.className}
      id={props.id}
      onClick={props.onClick}
      variant="text"
      color="mono"
      size="regular"
      active={props.active}
      disabled={props.disabled}
      data-testid="comment-reply-button"
    >
      <Icon>reply</Icon>
      <MatchMedia gtWidth="xs">
        <Localized id="comments-replyButton-reply">
          <span>Reply</span>
        </Localized>
      </MatchMedia>
    </Button>
  </Localized>
);

export default ReplyButton;
