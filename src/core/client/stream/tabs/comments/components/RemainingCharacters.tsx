import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Typography } from "talk-ui/components";

interface Props {
  className?: string;
  remaining: number;
}

const RemainingCharacters: StatelessComponent<Props> = props => {
  return (
    <div className={cn(props.className)}>
      <Localized id="comments-remainingCharacters" $remaining={props.remaining}>
        <Typography
          variant="detail"
          align="right"
          container="div"
          color="textSecondary"
        >
          {"X characters remaining"}
        </Typography>
      </Localized>
    </div>
  );
};

export default RemainingCharacters;
