import React from "react";

import { Button, ButtonIcon, MatchMedia } from "talk-ui/components";

interface ReactionButtonProps {
  onClick: () => void;
  totalReactions: number;
  reacted: boolean | null;
  label: string;
  labelActive: string | null;
  icon: string;
  iconActive: string | null;
  // color: string;
}

class ReactionButton extends React.Component<ReactionButtonProps> {
  public render() {
    const { totalReactions, reacted } = this.props;
    return (
      <Button variant="ghost" size="small" onClick={this.props.onClick}>
        {!!totalReactions && <span>{totalReactions}</span>}
        <MatchMedia gtWidth="xs">
          <ButtonIcon>
            {reacted
              ? this.props.iconActive
                ? this.props.iconActive
                : this.props.icon
              : this.props.icon}
          </ButtonIcon>
        </MatchMedia>
        <span>
          {reacted
            ? this.props.labelActive
              ? this.props.labelActive
              : this.props.label
            : this.props.label}
        </span>
      </Button>
    );
  }
}

export default ReactionButton;
