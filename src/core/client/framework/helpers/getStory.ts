import { Environment } from "relay-runtime";

export default function getStory(environment: Environment, id: string) {
  return environment
    .getStore()
    .getSource()
    .get(id);
}
