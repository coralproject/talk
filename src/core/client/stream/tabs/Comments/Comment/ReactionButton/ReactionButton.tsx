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

function getRootLocalizationId(reacted: boolean | null, isQA?: boolean) {
  if (isQA) {
    return reacted ? "qa-reaction-aria-voted" : "qa-reaction-aria-vote";
  }

  // We don't have an id here because the value is set
  // directly via the aria-label's provided
  return "";
}

class ReactionButton extends React.Component<ReactionButtonProps> {
  public render() {
    const { totalReactions, reacted, readOnly, className, isQA } = this.props;
    return (
      <Localized
        id={getRootLocalizationId(reacted, isQA)}
        attrs={{ "aria-label": true }}
      >
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
          aria-label={reacted ? this.props.labelActive : this.props.label}
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
      </Localized>
    );
  }
}

export default ReactionButton;
