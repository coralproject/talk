import { useCallback } from "react";

import useDateTimeFormat from "./useDateTimeFormat";

export default function useDateTimeFormatter(
  options: Intl.DateTimeFormatOptions
) {
  const formatter = useDateTimeFormat(options);
  const format = useCallback(
    (date: string | number | Date) => {
      if (typeof date === "string" || typeof date === "number") {
        return formatter.format(new Date(date));
      }

      return formatter.format(date);
    },
    [formatter]
  );

  return format;
}
