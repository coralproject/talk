import { useUIContext } from "coral-ui/components/v2";

import useShadowRoot from "./useShadowRoot";

const useShadowRootOrDocument: () => ShadowRoot | Document = () => {
  const context = useUIContext();
  const root = useShadowRoot();
  return root || context.renderWindow.document;
};

export default useShadowRootOrDocument;
