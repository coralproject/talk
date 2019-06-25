import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";

import { withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import Backdrop from "../Backdrop";
import ClickOutside from "../ClickOutside";
import NoScroll from "../NoScroll";
import TrapFocus from "../TrapFocus";

import styles from "./Modal.css";

function appendDivNode() {
  const div = document.createElement("div");
  document.body.append(div);
  div.setAttribute("data-portal", "modal");
  return div;
}

/**
 * useDOMNode is a React hook that returns a DOM node
 * to be used as a portal for the modal.
 * @param open whether the modal is open or not.
 */
function useDOMNode(open: boolean) {
  const [modalDOMNode, setModalDOMNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open) {
      const node = appendDivNode();
      setModalDOMNode(node);
      return () => {
        node!.parentElement!.removeChild(node!);
        setModalDOMNode(null);
      };
    }
    return;
  }, [open]);
  return modalDOMNode;
}

interface Props {
  onClose?: (
    event: React.KeyboardEvent | MouseEvent | undefined,
    reason: "backdropClick" | "escapeKeyDown"
  ) => void;
  onBackdropClick?: (e: MouseEvent | undefined) => void;
  onEscapeKeyDown?: React.EventHandler<React.KeyboardEvent>;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  open?: boolean;
  children?: PropTypesOf<typeof TrapFocus>["children"];
}

const Modal: FunctionComponent<Props> = ({
  classes,
  open,
  onClose,
  className,
  onBackdropClick,
  onEscapeKeyDown,
  children,
  ...rest
}) => {
  const rootClassName = cn(classes.root, className);

  const modalDOMNode = useDOMNode(Boolean(open));
  const handleEscapeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.keyCode === 27) {
        if (onEscapeKeyDown) {
          onEscapeKeyDown(e);
        }
        if (onClose) {
          onClose(e, "escapeKeyDown");
        }
      }
    },
    [onEscapeKeyDown, onClose]
  );
  const handleBackdropClick = useCallback(
    (e: MouseEvent | undefined) => {
      if (onBackdropClick) {
        onBackdropClick(e);
      }
      if (onClose) {
        onClose(e, "backdropClick");
      }
    },
    [onBackdropClick, onClose]
  );

  if (open && modalDOMNode) {
    return ReactDOM.createPortal(
      <div
        className={rootClassName}
        onKeyDown={handleEscapeKeyDown}
        {...rest}
        role="modal"
      >
        <NoScroll active={open} />
        <Backdrop active={open} data-testid="backdrop" />
        <div className={styles.scroll}>
          <div className={styles.alignContainer1}>
            <div className={styles.alignContainer2}>
              <ClickOutside onClickOutside={handleBackdropClick}>
                <div>
                  <TrapFocus>{children}</TrapFocus>
                </div>
              </ClickOutside>
            </div>
          </div>
        </div>
      </div>,
      modalDOMNode
    );
  }
  return null;
};

const enhanced = withStyles(styles)(Modal);
export default enhanced;
