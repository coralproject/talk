import { ReactTestInstance } from "react-test-renderer";

export interface ReactTestRendererJSON {
  type: string;
  props: { [propName: string]: any };
  children: null | ReactTestRendererNode[];
  $$typeof?: symbol; // Optional because we add it with defineProperty().
}
export type ReactTestRendererNode = ReactTestRendererJSON | string;

export function toJSONRecursive(
  inst: ReactTestInstance
): ReactTestRendererNode[] | null {
  const { children: _, ...props }: any = inst.props || {};
  let renderedChildren = null;
  if (inst.children) {
    for (const child of inst.children) {
      const renderedChild =
        typeof child === "string" ? [child] : toJSONRecursive(child);
      if (renderedChild !== null) {
        if (renderedChildren === null) {
          renderedChildren = [...renderedChild];
        } else {
          renderedChildren.push(...renderedChild);
        }
      }
    }
  }
  if (typeof inst.type === "string") {
    const json: ReactTestRendererJSON = {
      type: inst.type,
      props,
      children: renderedChildren,
    };
    Object.defineProperty(json, "$$typeof", {
      value: Symbol.for("react.test.json"),
    });
    return [json];
  }
  return renderedChildren;
}

/**
 * Turns a ReactTestInstance into JSON for snapshotting purposes.
 */
export default function toJSON(
  inst: ReactTestInstance
): ReactTestRendererNode | ReactTestRendererNode[] | null {
  const result = toJSONRecursive(inst);
  if (!result) {
    return null;
  }
  if (result.length === 1) {
    return result[0];
  }
  return result;
}
