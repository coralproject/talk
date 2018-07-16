import React, { CSSProperties } from "react";
import { Manager, Popper, Reference, RefHandler } from "react-popper";

interface RenderProps {
  ref: RefHandler;
  style?: CSSProperties;
}

interface InnerProps {
  body: React.ReactElement<any> | null;
  children: (props: RenderProps) => React.ReactElement<any>;
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
    const { children, body, placement = "top" } = this.props;
    return (
      <Manager>
        <Reference>{(props: Props) => children({ ref: props.ref })}</Reference>
        <Popper
          placement={placement}
          modifiers={{ preventOverflow: { enabled: false } }}
          eventsEnabled
          positionFixed={false}
        >
          {({ ref, style }) =>
            body
              ? React.cloneElement(body, {
                  ref,
                  style,
                })
              : null
          }
        </Popper>
      </Manager>
    );
  }
}

export default Attachment;
