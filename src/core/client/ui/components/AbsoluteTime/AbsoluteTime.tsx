import React, { FunctionComponent, useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { Typography } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

interface Props {
  date: string;
  className?: string;
}

const AbsoluteTime: FunctionComponent<Props> = ({ date, className }) => {
  const { locales } = useCoralContext();
  const formatted = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locales, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    return formatter.format(new Date(date));
  }, [locales, date]);
  return (
    <Typography className={className} variant="timestamp">
      {formatted}
    </Typography>
  );
};

export default AbsoluteTime;

export type AbsoluteTimeProps = PropTypesOf<typeof AbsoluteTime>;
