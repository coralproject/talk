import StreamControl from "./StreamControl";

interface Config {
  assetID?: string;
  assetURL?: string;
}

export function render(target: HTMLElement, config: Config = {}) {
  if (!target) {
    throw new Error(
      "Please provide Talk.render() the HTMLElement you want to render Talk in."
    );
  }
  if (!target.id) {
    throw new Error(
      "Please add an id to the HTMLElement you want to render Talk in."
    );
  }
  return new StreamControl(target);
}
