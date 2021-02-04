import groupBy from "lodash/groupBy";

import introspection from "../data/__generated__/introspection.json";

export const reference = groupBy(introspection.__schema.types, "kind");

export function getReferences() {
  return introspection.__schema.types;
}

export interface Reference {
  pagePath: string;
  reference: {
    kind: string;
    name: string;
    description: string | null;
  };
}

export async function renderReference(
  kind: string,
  name: string
): Promise<Reference | undefined> {
  const KIND = kind.toUpperCase();
  const ref = introspection.__schema.types.find((type) => {
    return type.kind === KIND && type.name === name;
  });
  if (!ref) {
    return;
  }

  return {
    pagePath: `/reference/${kind}/${name}`,
    reference: ref,
  };
}
