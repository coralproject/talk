import React, { FunctionComponent, useMemo } from "react";

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

  return <span className={className}>{formatted}</span>;
};

export default AbsoluteTime;

export type AbsoluteTimeProps = PropTypesOf<typeof AbsoluteTime>;
