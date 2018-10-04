import React, { EventHandler, MouseEvent } from "react";
import { StatelessComponent } from "react";

import { Localized } from "fluent-react/compat";
import { Button } from "talk-ui/components";

export interface ShowConversationLinkProps {
  id?: string;
  href?: string;
  onClick?: EventHandler<MouseEvent>;
}

const ShowConversationLink: StatelessComponent<
  ShowConversationLinkProps
> = props => {
  return (
    <Localized id="comments-showConversationLink-readMore">
      <Button
        id={props.id}
        variant="underlined"
        color="primary"
        href={props.href}
        onClick={props.onClick}
        target="_parent"
        anchor
      >
        Read More of this Conversation >
      </Button>
    </Localized>
  );
};

export default ShowConversationLink;
