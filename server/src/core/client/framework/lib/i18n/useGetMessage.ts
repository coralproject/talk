import { useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

import getMessage from "./getMessage";

const useGetMessage = () => {
  const { localeBundles } = useCoralContext();
  const f = useMemo(() => {
    return function <T extends {}>(id: string, defaultTo: string, args?: T) {
      return getMessage(localeBundles, id, defaultTo, args);
    };
  }, [localeBundles]);
  return f;
};

export default useGetMessage;
