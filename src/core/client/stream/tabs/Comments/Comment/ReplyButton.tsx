import { Localized } from "@fluent/react/compat";
import React, { EventHandler, FunctionComponent, MouseEvent } from "react";

import { Button, Icon, MatchMedia } from "coral-ui/components";

interface Props {
  id?: string;
  onClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

const ReplyButton: FunctionComponent<Props> = props => (
  <Button
    className={props.className}
    id={props.id}
    onClick={props.onClick}
    variant="textUnderlined"
    color="primary"
    size="small"
    active={props.active}
    disabled={props.disabled}
  >
    <MatchMedia gtWidth="xs">
      <Icon>reply</Icon>
    </MatchMedia>
    <Localized id="comments-replyButton-reply">
      <span>Reply</span>
    </Localized>
  </Button>
);

export default ReplyButton;
