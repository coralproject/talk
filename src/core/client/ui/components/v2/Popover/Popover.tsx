import cn from "classnames";
import React from "react";
import { Manager, Popper, Reference, RefHandler } from "react-popper";

import { oncePerFrame } from "coral-common/utils";
import { withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import { AriaInfo } from "coral-ui/components";

import Arrow from "./Arrow";
import styles from "./Popover.css";

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
  /** toggles visibility, if event is provided, the event will stop propagating. */
  toggleVisibility: (event?: React.SyntheticEvent | Event) => void;
  visible: boolean;
  scheduleUpdate: () => void;
}

interface ChildrenRenderProps {
  /** toggles visibility, if event is provided, the event will stop propagating. */
  toggleVisibility: (event?: React.SyntheticEvent | Event) => void;
  ref?: RefHandler;
  visible: boolean;
}

interface PopoverProps {
  body: (props: BodyRenderProps) => React.ReactNode | React.ReactElement<any>;
  children: (props: ChildrenRenderProps) => React.ReactNode;
  description?: string;
  id: string;
  className?: string;
  placement?: Placement;
  visible?: boolean;
  classes: typeof styles;
  modifiers?: PropTypesOf<typeof Popper>["modifiers"];
  eventsEnabled?: PropTypesOf<typeof Popper>["eventsEnabled"];
  positionFixed?: PropTypesOf<typeof Popper>["positionFixed"];
  dark?: boolean;
}

interface State {
  visible: boolean;
}

class Popover extends React.Component<PopoverProps> {
  public static defaultProps: Partial<PopoverProps> = {
    placement: "top",
  };
  public state: State = {
    visible: false,
  };

  private toggleVisibility = (() => {
    let fn = (event?: React.SyntheticEvent | Event) => {
      this.setState((state: State) => ({
        visible: !state.visible,
      }));
    };
    if (process.env.NODE_ENV !== "test") {
      /**
       * Only run this once per frame in the browser, otherwise
       * we might get into a situation where this is called twice
       * by different event handlers cancelling each other out.
       *
       * We don't wan this behavior when running in a simulated browser
       * environment with simulated events.
       */
      fn = oncePerFrame(fn);
    }
    return fn;
  })();

  private close = () => {
    this.setState((state: State) => ({
      visible: false,
    }));
  };

  private handleEsc = (e: KeyboardEvent) => {
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
      visible: controlledVisible,
      positionFixed,
      modifiers,
      eventsEnabled,
      dark,
      ...rest
    } = this.props;

    const visible =
      controlledVisible !== undefined ? controlledVisible : this.state.visible;
    const includeArrow =
      !modifiers || !modifiers.arrow || modifiers.arrow.enabled;
    const popoverClassName = cn(classes.popover, {
      [classes.top]: placement!.startsWith("top"),
      [classes.left]: placement!.startsWith("left"),
      [classes.right]: placement!.startsWith("right"),
      [classes.bottom]: placement!.startsWith("bottom"),
    });

    return (
      <div className={cn(classes.root, className)} {...rest}>
        <Manager>
          <Reference>
            {props =>
              children({
                ref: props.ref,
                toggleVisibility: this.toggleVisibility,
                visible,
              })
            }
          </Reference>
          <Popper
            placement={placement}
            eventsEnabled={eventsEnabled}
            positionFixed={positionFixed}
            modifiers={modifiers}
          >
            {props => (
              <div
                id={id}
                role="dialog"
                aria-labelledby={`${id}-ariainfo`}
                aria-hidden={!visible}
              >
                {description && (
                  <AriaInfo id={`${id}-ariainfo`}>{description}</AriaInfo>
                )}
                {visible && (
                  <div
                    style={props.style}
                    className={cn(popoverClassName, {
                      [classes.colorDark]: dark,
                    })}
                    ref={props.ref}
                  >
                    {includeArrow && (
                      <Arrow
                        ref={props.arrowProps.ref}
                        data-placement={props.placement}
                        style={props.arrowProps.style}
                        dark={dark}
                      />
                    )}
                    {typeof body === "function"
                      ? body({
                          scheduleUpdate: props.scheduleUpdate,
                          toggleVisibility: this.toggleVisibility,
                          visible,
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
