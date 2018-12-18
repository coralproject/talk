import { noop } from "lodash";
import { ReactElement } from "react";

export default function createNodeMock(element: ReactElement<any>) {
  if (element.type === "div") {
    return {
      innerHtml: "",
      className: "",
      focus: noop,
    };
  }
  return null;
}
