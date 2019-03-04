import { Localized } from "fluent-react/compat";
import React, { EventHandler, MouseEvent, StatelessComponent } from "react";

import { Button, ButtonIcon, MatchMedia } from "talk-ui/components";

interface Props {
  id?: string;
  onClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
  active?: boolean;
  disabled?: boolean;
}

const ReplyButton: StatelessComponent<Props> = props => (
  <Button
    id={props.id}
    onClick={props.onClick}
    variant="ghost"
    size="small"
    active={props.active}
    disabled={props.disabled}
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
