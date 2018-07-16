import cn from "classnames";
import React from "react";
import { Manager, Popper, Reference } from "react-popper";
import * as styles from "./Attachment.css";

interface InnerProps {
  body: React.ReactElement<any> | null;
  children: React.ReactElement<any>;
  className?: string;
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

interface Props {
  ref: any;
}

class Attachment extends React.Component<InnerProps> {
  public render() {
    const { children, body, placement = "top", className } = this.props;
    return (
      <Manager>
        <Reference>
          {(props: Props) => React.cloneElement(children, { ref: props.ref })}
        </Reference>

        <Popper
          placement={placement}
          modifiers={{ preventOverflow: { enabled: false } }}
          eventsEnabled
          positionFixed={false}
        >
          {({ ref, style }) =>
            body &&
            React.cloneElement(body, {
              ref,
              style,
              className: cn(styles.root, className),
            })
          }
        </Popper>
      </Manager>
    );
  }
}

export default Attachment;
