import cn from "classnames";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Manager, Popper, Reference } from "react-popper";

import { oncePerFrame } from "coral-common/utils";
import { withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import withUIContext from "../UIContext/withUIContext";
import Arrow from "./Arrow";

import styles from "./Popover.css";

export type Placement =
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
  ref?: React.Ref<any>;
  visible: boolean;
}

interface PopoverProps {
  /**
   * body supports render props from the body or a react node itself.
   */
  body:
    | ((props: BodyRenderProps) => React.ReactNode | React.ReactElement<any>)
    | React.ReactNode
    | React.ReactElement<any>;
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
  window: Window;
}

const Popover: FunctionComponent<PopoverProps> = ({
  body,
  children,
  description,
  id,
  className,
  placement = "top",
  visible: controlledVisible,
  classes,
  modifiers,
  eventsEnabled,
  positionFixed,
  dark,
  window,
  ...rest
}) => {
  const [visibleState, setVisibleState] = useState(false);
  const [toggledThisFrame, setToggledThisFrame] = useState(false);
  const visible =
    controlledVisible !== undefined ? controlledVisible : visibleState;
  const includeArrow =
    !modifiers || !modifiers.arrow || modifiers.arrow.enabled;
  const popoverClassName = cn(classes.popover, {
    [classes.top]: placement.startsWith("top"),
    [classes.left]: placement.startsWith("left"),
    [classes.right]: placement.startsWith("right"),
    [classes.bottom]: placement.startsWith("bottom"),
  });

  const toggleVisibility = (() => {
    let fn = (event?: React.SyntheticEvent | Event) => {
      setVisibleState(!visibleState);
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
      fn = oncePerFrame(fn, toggledThisFrame, setToggledThisFrame);
    }
    return fn;
  })();

  const close = () => {
    setVisibleState(false);
  };

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  useEffect(() => {
    window.document.addEventListener("keydown", handleEsc, true);

    return () => {
      window.document.removeEventListener("keydown", handleEsc, true);
    };
  }, []);

  return (
    <div className={cn(classes.root, className)} {...rest}>
      <Manager>
        <Reference>
          {(props) => {
            return children({
              ref: props.ref,
              toggleVisibility,
              visible,
            });
          }}
        </Reference>
        <Popper
          placement={placement}
          eventsEnabled={eventsEnabled}
          positionFixed={positionFixed}
          modifiers={modifiers}
        >
          {(props) => {
            return (
              <div
                id={id}
                role="dialog"
                aria-label={description}
                aria-hidden={!visible}
              >
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
                          toggleVisibility,
                          visible,
                        })
                      : body}
                  </div>
                )}
              </div>
            );
          }}
        </Popper>
      </Manager>
    </div>
  );
};

const enhanced = withStyles(styles)(
  withUIContext(({ renderWindow }) => ({ window: renderWindow }))(Popover)
);

export default enhanced;
