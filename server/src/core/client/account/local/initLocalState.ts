import { InitLocalState } from "coral-framework/lib/bootstrap/createManaged";
import { initLocalBaseState } from "coral-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
const initLocalState: InitLocalState = async (deps) => {
  await initLocalBaseState(deps);
};
export default initLocalState;
