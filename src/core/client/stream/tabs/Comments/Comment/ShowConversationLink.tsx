import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  EventHandler,
  FunctionComponent,
  MouseEvent,
  useMemo
} from "react";

import { Button } from "coral-ui/components/v2";

import styles from "./ShowConversationLink.css";

export interface ShowConversationLinkProps {
  id?: string;
  href?: string;
  onClick?: EventHandler<MouseEvent>;
  className?: string;
}

const ShowConversationLink: FunctionComponent<
  ShowConversationLinkProps
> = props => {
  const classesOverride = useMemo(
    () => ({
      colorRegular: styles.colorRegular,
      active: styles.active,
      mouseHover: styles.mouseHover,
      disabled: styles.disabled
    }),
    [styles]
  );

  return (
    <Localized id="comments-showConversationLink-readMore">
      <Button
        id={props.id}
        className={cn(styles.conversationLink, props.className)}
        variant="textUnderlined"
        color="regular"
        classes={classesOverride}
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
