import { Localized } from "fluent-react/compat";
import React, { EventHandler, FunctionComponent, MouseEvent } from "react";

import { Button, ButtonIcon, MatchMedia } from "coral-ui/components";

interface Props {
  id?: string;
  onClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

const ReplyButton: FunctionComponent<Props> = props => (
  <Button
    id={props.id}
    onClick={props.onClick}
    variant="ghost"
    size="small"
    active={props.active}
    disabled={props.disabled}
    className={props.className}
  >
    <MatchMedia gtWidth="xs">
      <ButtonIcon>reply</ButtonIcon>
    </MatchMedia>
    <Localized id="comments-replyButton-reply">
      <span>Reply</span>
    </Localized>
  </Button>
);

export default ReplyButton;
