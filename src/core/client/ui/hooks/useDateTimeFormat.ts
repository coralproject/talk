import { useMemo } from "react";

import { useUIContext } from "coral-ui/components";

export default function useDateTimeFormat(options: Intl.DateTimeFormatOptions) {
  const { locales } = useUIContext();
  return useMemo(() => new Intl.DateTimeFormat(locales, options), [
    locales,
    options,
  ]);
}
