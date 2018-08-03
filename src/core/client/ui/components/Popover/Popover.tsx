import cn from "classnames";
import React from "react";
import {
  Manager,
  Popper,
  PopperArrowProps,
  Reference,
  RefHandler,
} from "react-popper";
import AriaInfo from "../AriaInfo";
import * as styles from "./Popover.css";

type Placement =
  | "auto-start"
  | "auto"
  | "auto-end"
  | "top-start"
  | "top"
  | "top-end"
  | "right-start"
  | "right"
  | "right-end"
  | "bottom-end"
  | "bottom"
  | "bottom-start"
  | "left-end"
  | "left"
  | "left-start";

interface BodyRenderProps {
  toggleVisibility: () => void;
  visible: boolean;
}

interface ChildrenRenderProps {
  toggleVisibility: () => void;
  forwardRef?: RefHandler;
  visible: boolean;
}

interface PopoverProps {
  body: (props: BodyRenderProps) => React.ReactNode | React.ReactElement<any>;
  children: (props: ChildrenRenderProps) => React.ReactNode;
  description: string;
  id: string;
  onClose?: () => void;
  className?: string;
  placement?: Placement;
}

interface State {
  visible: false;
}

class Popover extends React.Component<PopoverProps> {
  public state: State = {
    visible: false,
  };

  public toggleVisibility = () => {
    this.setState((state: State) => ({
      visible: !state.visible,
    }));
  };

  public close = () => {
    this.setState((state: State) => ({
      visible: false,
    }));
  };

  public handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      this.close();
    }
  };

  public componentDidMount() {
    document.addEventListener("keydown", this.handleEsc, true);
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEsc, true);
  }

  public render() {
    const {
      id,
      body,
      children,
      description,
      className,
      placement,
    } = this.props;

    const { visible } = this.state;

    return (
      <Manager>
        <Reference>
          {(props: PopperArrowProps) =>
            children({
              forwardRef: props.ref,
              toggleVisibility: this.toggleVisibility,
              visible: this.state.visible,
            })
          }
        </Reference>
        <Popper placement={placement} eventsEnabled positionFixed={false}>
          {(props: PopperArrowProps) => (
            <div
              id={id}
              role="popup"
              aria-labelledby={`${id}-ariainfo`}
              aria-hidden={!visible}
            >
              <AriaInfo id={`${id}-ariainfo`}>{description}</AriaInfo>
              {visible && (
                <div
                  style={props.style}
                  className={cn(styles.root, className)}
                  ref={props.ref}
                >
                  {typeof body === "function"
                    ? body({
                        toggleVisibility: this.toggleVisibility,
                        visible: this.state.visible,
                      })
                    : body}
                </div>
              )}
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

export default Popover;
