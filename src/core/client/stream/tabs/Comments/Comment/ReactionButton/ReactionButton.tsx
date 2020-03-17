import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React from "react";

import { Button, Icon, MatchMedia } from "coral-ui/components/v2";
import { ButtonProps } from "coral-ui/components/v2/Button";

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
  color?: typeof styles & ButtonProps["color"];
  isQA?: boolean;
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
  } = props;

  return (
    <Button
      variant="text"
      size="regular"
      onClick={onClick}
      disabled={readOnly}
      color="mono"
      className={cn({ [styles.readOnly]: readOnly }, className, styles.button)}
      aria-label={reacted ? labelActive : label}
      data-testid={"comment-reaction-button"}
    >
      {props.isQA ? (
        <Icon>arrow_upward</Icon>
      ) : (
        <Icon className={reacted ? styles.reacted : ""}>
          {reacted ? (iconActive ? iconActive : icon) : icon}
        </Icon>
      )}
      <MatchMedia gtWidth="xs">
        {props.isQA ? (
          <span className={reacted ? styles.reacted : ""}>
            {reacted ? (
              <Localized id="qa-reaction-voted">Voted</Localized>
            ) : (
              <Localized id="qa-reaction-vote">Vote</Localized>
            )}
          </span>
        ) : (
          <span className={reacted ? styles.reacted : ""}>
            {reacted ? labelActive : label}
          </span>
        )}
      </MatchMedia>

      {!!totalReactions && (
        <span className={reacted ? styles.reacted : ""}>{totalReactions}</span>
      )}
    </Button>
  );
}

class ReactionButton extends React.Component<ReactionButtonProps> {
  public render() {
    const { reacted, isQA } = this.props;

    if (isQA) {
      return (
        <Localized
          id={reacted ? "qa-reaction-aria-voted" : "qa-reaction-aria-vote"}
          attrs={{ "aria-label": true }}
        >
          {render(this.props)}
        </Localized>
      );
    }

    return <>{render(this.props)}</>;
  }
}

export default ReactionButton;
