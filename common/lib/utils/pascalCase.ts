import camelCase from "lodash.camelcase";

export default function pascalCase(value: string) {
  return value[0].toUpperCase() + camelCase(value).slice(1);
}
