import { FunctionComponent } from "react";

declare module "found" {
  const ElementsRenderer: FunctionComponent<{
    elements: ReactElementOrGroup[];
  }>;
}
