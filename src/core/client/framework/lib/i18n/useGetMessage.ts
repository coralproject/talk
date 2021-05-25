import { useCoralContext } from "coral-framework/lib/bootstrap";
import getMessage from "./getMessage";

const useGetMessage = () => {
  const { localeBundles } = useCoralContext();
  return function <T extends {}>(id: string, defaultTo: string, args?: T) {
    return getMessage(localeBundles, id, defaultTo, args);
  };
};

export default useGetMessage;
