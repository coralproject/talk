import { Environment } from "relay-runtime";

import { LOCAL_ID } from "./localState";
import lookup from "./lookup";

const lookupLocal = <T>(environment: Environment) =>
  lookup<T>(environment, LOCAL_ID)!;

export default lookupLocal;
