import { useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

/**
 * useUUID returns a unique identifier.
 */
export default function useUUID(): string {
  const { uuidGenerator } = useCoralContext();
  return useMemo(() => uuidGenerator(), []);
}
