import { useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

export default function useDateTimeFormat(options: Intl.DateTimeFormatOptions) {
  const { locales } = useCoralContext();
  return useMemo(() => new Intl.DateTimeFormat(locales, options), [
    locales,
    options,
  ]);
}
