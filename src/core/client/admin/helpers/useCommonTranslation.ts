import { useMemo } from "react";

import { useGetMessage } from "coral-framework/lib/i18n";

export const enum COMMON_TRANSLATION {
  NOT_AVAILABLE,
}

export default function useCommonTranslation(which: COMMON_TRANSLATION) {
  const getMessage = useGetMessage();
  return useMemo(() => {
    switch (which) {
      case COMMON_TRANSLATION.NOT_AVAILABLE:
        return getMessage("general-notAvailable", "Not Available");
    }
  }, [getMessage, which]);
}
