import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { AlertTriangleIcon, SvgIcon } from "coral-ui/components/icons";
import { Flex, Typography } from "coral-ui/components/v2";

interface Props {
  className?: string;
  remaining: number;
}

const RemainingCharacters: FunctionComponent<Props> = (props) => {
  const belowZero = props.remaining < 0;
  return (
    <Flex
      className={cn(props.className)}
      alignItems="center"
      justifyContent="flex-end"
      itemGutter="half"
    >
      {belowZero && <SvgIcon color="error" Icon={AlertTriangleIcon} />}
      <Localized
        id="comments-remainingCharacters"
        vars={{ remaining: props.remaining }}
      >
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
