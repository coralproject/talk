import React, { FunctionComponent, useMemo } from "react";

import { Typography } from "coral-ui/components";
import { useDateTimeFormatter } from "coral-ui/hooks";
import { PropTypesOf } from "coral-ui/types";

interface Props {
  date: string;
  className?: string;
}

const AbsoluteTime: FunctionComponent<Props> = ({ date, className }) => {
  const formatter = useDateTimeFormatter({
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const formatted = useMemo(() => formatter(date), [formatter, date]);

  return (
    <Typography className={className} variant="timestamp">
      {formatted}
    </Typography>
  );
};

export default AbsoluteTime;

export type AbsoluteTimeProps = PropTypesOf<typeof AbsoluteTime>;
