import React, { FunctionComponent, useMemo } from "react";

import { useUIContext } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

interface Props {
  date: string;
  className?: string;
  locales?: string[];
}

const AbsoluteTime: FunctionComponent<Props> = ({
  date,
  className,
  locales: localesFromProps,
}) => {
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
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
  return <span className={className}>{formatted}</span>;
};

export default AbsoluteTime;

export type AbsoluteTimeProps = PropTypesOf<typeof AbsoluteTime>;
