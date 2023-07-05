import Squire from "squire-rte";

import createToggle from "@coralproject/rte/lib/factories/createToggle";

interface Props {
  sarcasmClassName?: string;
}

function execCommand(squire: Squire, props: Props) {
  const attributes = { class: props.sarcasmClassName! };
  if (squire.hasFormat("SPAN", attributes)) {
    squire.changeFormat(null, { tag: "SPAN", attributes });
  } else {
    squire.changeFormat({ tag: "SPAN", attributes }, null);
  }
  squire.focus();
}

function isActive(squire: Squire, props: Props) {
  const attributes = { class: props.sarcasmClassName! };
  return squire.hasFormat("SPAN", attributes);
}

const Sarcasm = createToggle<Props>(execCommand, {
  isActive,
});

Sarcasm.defaultProps = {
  children: "Sarcasm",
  sarcasmClassName: "coral-rte-sarcasm",
};

export default Sarcasm;
