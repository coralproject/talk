import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React from "react";
import Responsive from "react-responsive";

import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./ReactionButton.css";

interface ReactionButtonProps {
  onClick: () => void;
  totalReactions: number;
  reacted: boolean | null;
  label: string;
  labelActive: string;
  icon: string;
  iconActive: string | null;
  readOnly?: boolean;
  className?: string;
  isQA?: boolean;
  author?: string | null;
  iconClassName?: string | null;
}

function render(props: ReactionButtonProps) {
  const {
    totalReactions,
    reacted,
    readOnly,
    className,
    onClick,
    labelActive,
    label,
    icon,
    iconActive,
    iconClassName,
  } = props;

  return (
    <Button
      onClick={onClick}
      disabled={readOnly}
      className={cn(
        { [styles.readOnly]: readOnly, [styles.reacted]: reacted },
        className,
        styles.button
      )}
      active={Boolean(reacted)}
      data-testid={"comment-reaction-button"}
      variant="flat"
      color={reacted ? "primary" : "secondary"}
      fontSize="small"
      fontWeight="semiBold"
      paddingSize="extraSmall"
    >
      <Flex alignItems="center" container="span">
        {props.isQA ? (
          <Icon className={styles.icon}>arrow_upward</Icon>
        ) : (
          <Icon className={cn(styles.icon, iconClassName)}>
            {reacted ? (iconActive ? iconActive : icon) : icon}
          </Icon>
        )}
        <Responsive minWidth={400}>
          {props.isQA ? (
            <span>
              {reacted ? (
                <Localized id="qa-reaction-voted">Voted</Localized>
              ) : (
                <Localized id="qa-reaction-vote">Vote</Localized>
              )}
            </span>
          ) : (
            <span>{reacted ? labelActive : label}</span>
          )}
        </Responsive>
        {!!totalReactions && (
          <span className={styles.totalReactions}>{totalReactions}</span>
        )}
      </Flex>
    </Button>
  );
}

class ReactionButton extends React.Component<ReactionButtonProps> {
  public render() {
    const { reacted, label, labelActive, totalReactions, isQA, author } =
      this.props;

    if (isQA) {
      return (
        <Localized
          id={reacted ? "qa-reaction-aria-voted" : "qa-reaction-aria-vote"}
          attrs={{ "aria-label": true }}
          vars={{ username: author!, count: totalReactions }}
        >
          {render(this.props)}
        </Localized>
      );
    }

    return (
      <Localized
        id={reacted ? "comments-reacted" : "comments-react"}
        attrs={{ "aria-label": true }}
        vars={{
          reaction: reacted ? labelActive : label,
          username: author,
          count: totalReactions,
        }}
      >
        {render(this.props)}
      </Localized>
    );
  }
}

export default ReactionButton;
