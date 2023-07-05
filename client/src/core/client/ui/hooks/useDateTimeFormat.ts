import { useMemo } from "react";

import { createDateFormatter } from "coral-common/date";
import { useUIContext } from "coral-ui/components/v2";

export default function useDateTimeFormat(options: Intl.DateTimeFormatOptions) {
  const { locales } = useUIContext();
  return useMemo(
    () => createDateFormatter(locales, options),
    [locales, options]
  );
}
