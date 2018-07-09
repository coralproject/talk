import React from "react";
import { Manager, Popper, Reference } from "react-popper";
// import * as styles from "./Popover.css";

interface InnerProps {
  body: React.ReactElement<any>;
  children: React.ReactElement<any>;
  placement?:
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
}

class Popover extends React.Component<InnerProps> {
  public render() {
    const { children, body, placement = "top" } = this.props;
    return (
      <Manager>
        <Reference>
          {({ ref }) => React.cloneElement(children, { ref })}
        </Reference>
        <Popper
          placement={placement}
          modifiers={{ preventOverflow: { enabled: false } }}
          eventsEnabled
          positionFixed={false}
        >
          {({ ref, style }) =>
            React.cloneElement(body, {
              ref,
              style,
            })
          }
        </Popper>
      </Manager>
    );
  }
}

export default Popover;
