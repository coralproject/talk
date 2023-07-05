import { FunctionComponent, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { useUIContext } from "../UIContext";

function appendDivNode(window: Window) {
  const div = window.document.createElement("div");
  window.document.body.append(div);
  div.setAttribute("data-portal", "modal");
  return div;
}

/**
 * useDOMNode is a React hook that returns a DOM node
 * to be used as a portal for the modal.
 *
 * @param open whether the modal is open or not.
 */
function useDOMNode(open: boolean) {
  const { renderWindow } = useUIContext();
  const [modalDOMNode, setModalDOMNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open) {
      const node = appendDivNode(renderWindow);
      setModalDOMNode(node);
      return () => {
        node.parentElement!.removeChild(node);
        setModalDOMNode(null);
      };
    }
    return;
  }, [open, renderWindow]);
  return modalDOMNode;
}

interface PortalProps {
  children?: React.ReactNode;
}

const Portal: FunctionComponent<PortalProps> = ({ children }) => {
  const modalDOMNode = useDOMNode(Boolean(open));
  if (modalDOMNode) {
    return ReactDOM.createPortal(children, modalDOMNode);
  }
  return null;
};

export default Portal;
