declare module "react-timeago" {
  import React from "react";

  export type Formatter = (
    value: number,
    unit: "second" | "minute" | "hour" | "day" | "week" | "month" | "year",
    suffix: "ago" | "from now",
    epochMiliseconds: string
  ) => string | React.ReactElement<any>;

  export interface LocaleDefinition {
    prefixAgo?: string;
    prefixFromNow?: string;
    suffixAgo?: string;
    suffixFromNow?: string;
    second?: string;
    seconds?: string;
    minute?: string;
    minutes?: string;
    hour?: string;
    hours?: string;
    day?: string;
    days?: string;
    week?: string;
    weeks?: string;
    month?: string;
    months?: string;
    year?: string;
    years?: string;
    wordSeparator?: string;
    numbers?: number[];
  }

  export interface TimeAgoProps {
    date: string;
    live?: boolean;
    className: string;
    formatter?: Formatter;
    minPeriod?: number;
  }

  const TimeAgo: React.ComponentType<TimeAgoProps>;
  export default TimeAgo;
}

declare module "react-timeago/lib/formatters/buildFormatter" {
  import { Formatter, LocaleDefinition } from "react-timeago";
  function buildFormatter(localeInput: LocaleDefinition): Formatter;
  export default buildFormatter;
}

declare module "react-timeago/lib/language-strings/*" {
  import { LocaleDefinition } from "react-timeago";
  const localeStrings: LocaleDefinition;
  export default localeStrings;
}
