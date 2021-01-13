import { ElementsRenderer } from "found";

declare module "found" {
  // TODO: (cvle) remove when merged https://github.com/4Catalyzer/found/pull/780
  const ElementsRenderer: ElementsRenderer;
}

declare module "found/ResolverUtils";
