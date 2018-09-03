import { Localized } from "fluent-react/compat";
import React, { EventHandler, MouseEvent, StatelessComponent } from "react";

import { Button, ButtonIcon, MatchMedia } from "talk-ui/components";

interface Props {
  onClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
  active?: boolean;
}

const ReplyButton: StatelessComponent<Props> = props => (
  <Button
    onClick={props.onClick}
    variant="ghost"
    size="small"
    active={props.active}
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
