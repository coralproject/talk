import cn from "classnames";
import React from "react";
import {
  Manager,
  Popper,
  PopperArrowProps,
  Reference,
  RefHandler,
} from "react-popper";

import { withStyles } from "talk-ui/hocs";

import AriaInfo from "../AriaInfo";
import * as styles from "./Popover.css";

type Placement =
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
  classes: typeof styles;
}

interface State {
  visible: false;
}

class Popover extends React.Component<PopoverProps> {
  public static defaultProps: Partial<PopoverProps> = {
    placement: "top",
  };
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
      classes,
    } = this.props;

    const { visible } = this.state;
    const popoverClassName = cn(classes.popover, {
      [classes.top]: placement!.startsWith("top"),
      [classes.left]: placement!.startsWith("left"),
      [classes.right]: placement!.startsWith("right"),
      [classes.bottom]: placement!.startsWith("bottom"),
    });

    return (
      <div className={cn(classes.root, className)}>
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
                    className={popoverClassName}
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
      </div>
    );
  }
}

const enhanced = withStyles(styles)(Popover);

export default enhanced;
