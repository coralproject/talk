import { Localized } from "@fluent/react/compat";
import React, { EventHandler, FunctionComponent, MouseEvent } from "react";

import { Flex, Icon, MatchMedia } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./ReplyButton.css";

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
      disabled={props.disabled}
      data-testid="comment-reply-button"
      active={props.active}
      variant="flat"
      color="secondary"
      fontSize="small"
      fontWeight="semiBold"
      paddingSize="extraSmall"
    >
      <Flex alignItems="center" container="span">
        <Icon className={styles.icon}>reply</Icon>
        <MatchMedia gtWidth="xs">
          <Localized id="comments-replyButton-reply">
            <span>Reply</span>
          </Localized>
        </MatchMedia>
      </Flex>
    </Button>
  </Localized>
);

export default ReplyButton;
