import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Flex, Icon, Typography } from "talk-ui/components";

interface Props {
  className?: string;
  remaining: number;
}

const RemainingCharacters: StatelessComponent<Props> = props => {
  const belowZero = props.remaining < 0;
  return (
    <Flex
      className={cn(props.className)}
      alignItems="center"
      justifyContent="flex-end"
      itemGutter="half"
    >
      {belowZero && <Icon color="error">warning</Icon>}
      <Localized id="comments-remainingCharacters" $remaining={props.remaining}>
        <Typography
          variant="detail"
          container="div"
          color={belowZero ? "error" : "textSecondary"}
        >
          {"X characters remaining"}
        </Typography>
      </Localized>
    </Flex>
  );
};

export default RemainingCharacters;
