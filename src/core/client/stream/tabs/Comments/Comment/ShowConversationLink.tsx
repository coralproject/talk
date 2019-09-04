import React, { EventHandler, MouseEvent } from "react";
import { FunctionComponent } from "react";

import { Button } from "coral-ui/components";
import { Localized } from "fluent-react/compat";

export interface ShowConversationLinkProps {
  id?: string;
  href?: string;
  onClick?: EventHandler<MouseEvent>;
  className?: string;
}

const ShowConversationLink: FunctionComponent<
  ShowConversationLinkProps
> = props => {
  return (
    <Localized id="comments-showConversationLink-readMore">
      <Button
        id={props.id}
        className={props.className}
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
