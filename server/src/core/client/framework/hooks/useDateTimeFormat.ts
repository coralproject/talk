import { useMemo } from "react";

import { createDateFormatter } from "coral-common/date";
import { useCoralContext } from "coral-framework/lib/bootstrap";

export default function useDateTimeFormat(options: Intl.DateTimeFormatOptions) {
  const { locales } = useCoralContext();
  return useMemo(
    () => createDateFormatter(locales, options),
    [locales, options]
  );
}
