import { stripIndent } from "common-tags";
import prettier from "prettier";
import { ReactTestInstance } from "react-test-renderer";

import toJSON, { ReactTestRendererNode } from "./toJSON";

function convertPropertyToString(prop: string, value: any): string {
  let propOut = prop;
  let valueOut = "";

  if (propOut === "dangerouslySetInnerHTML") {
    return "";
  }

  // React uses `htmlFor` instead of `for` because of js restrictions.
  if (propOut === "htmlFor") {
    propOut = "for";
  }

  switch (typeof value) {
    case "function":
      valueOut = "[Function]";
      break;
    case "string":
      valueOut = value;
      break;
    case "undefined":
      valueOut = propOut;
      return "";
    case "boolean":
      // Usually true means the property has been set without a value
      // and false the property is not set.
      // Exception: aria-labels need to be set to  "true" / "false".
      if (!prop.startsWith("aria-")) {
        return value ? propOut : "";
      }
    // fall through
    default:
      valueOut = JSON.stringify(value);
  }
  valueOut = valueOut.replace('"', "&quot;");
  return `${propOut}="${valueOut}"`;
}

function convertJSONToHTML(
  node: ReactTestRendererNode | ReactTestRendererNode[]
): string {
  if (typeof node === "string") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((c) => convertJSONToHTML(c)).join("\n");
  }

  const props = Object.keys(node.props)
    .map((k) => convertPropertyToString(k, node.props[k]))
    .join(" ");

  let innerHTML = "";
  if ("dangerouslySetInnerHTML" in node.props) {
    innerHTML = node.props.dangerouslySetInnerHTML.__html;
  } else if (node.children) {
    innerHTML = convertJSONToHTML(node.children);
  }

  if (innerHTML === "") {
    return `<${node.type} ${props} />`;
  }
  return stripIndent`
    <${node.type} ${props}>
      ${innerHTML}
    </${node.type}>`;
}

/**
 * Turns a ReactTestInstance into its HTML representation.
 */
export default function toHTML(
  inst: ReactTestInstance,
  options: { pretty?: boolean } = {}
) {
  const result = toJSON(inst);
  if (result === null) {
    return "";
  }

  const output = convertJSONToHTML(result);
  return options.pretty ? prettier.format(output, { parser: "html" }) : output;
}
