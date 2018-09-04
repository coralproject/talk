import { ReactElement } from "react";

export default function createNodeMock(element: ReactElement<any>) {
  if (element.type === "div") {
    return {
      innerHtml: "",
    };
  }
  return null;
}
