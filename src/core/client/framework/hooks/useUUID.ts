import { useMemo } from "react";

import { useTalkContext } from "talk-framework/lib/bootstrap";

/**
 * useUUID returns a unique identifier.
 */
export default function useUUID(): string {
  const { uuidGenerator } = useTalkContext();
  return useMemo(() => uuidGenerator(), []);
}
