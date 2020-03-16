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

class ReactionButton extends React.Component<ReactionButtonProps> {
  public render() {
    const { totalReactions, reacted, readOnly, className } = this.props;
    return (
      <Button
        variant="text"
        size="regular"
        onClick={this.props.onClick}
        disabled={readOnly}
        color="mono"
        className={cn(
          { [styles.readOnly]: readOnly },
          className,
          styles.button
        )}
      >
        {this.props.isQA ? (
          <Icon>arrow_upward</Icon>
        ) : (
          <Icon className={reacted ? styles.reacted : ""}>
            {reacted
              ? this.props.iconActive
                ? this.props.iconActive
                : this.props.icon
              : this.props.icon}
          </Icon>
        )}
        <MatchMedia gtWidth="xs">
          {this.props.isQA ? (
            <span className={reacted ? styles.reacted : ""}>
              {reacted ? (
                <Localized id="qa-reaction-voted">Voted</Localized>
              ) : (
                <Localized id="qa-reaction-vote">Vote</Localized>
              )}
            </span>
          ) : (
            <span className={reacted ? styles.reacted : ""}>
              {reacted ? this.props.labelActive : this.props.label}
            </span>
          )}
        </MatchMedia>

        {!!totalReactions && (
          <span className={reacted ? styles.reacted : ""}>
            {totalReactions}
          </span>
        )}
      </Button>
    );
  }
}

export default ReactionButton;
