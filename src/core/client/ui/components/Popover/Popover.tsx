import cn from "classnames";
import React, { CSSProperties, isValidElement } from "react";
import { Manager, Popper, Reference, RefHandler } from "react-popper";
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

interface InnerProps {
  body: (props: RenderProps) => any | React.ReactElement<any>;
  // body: React.ReactElement<any> | null;
  children: (props: RenderProps) => any;
  description?: string;
  id?: string;
  onClose?: () => void;
  className?: string;
  placement?: Placement;
}

interface State {
  visible: false;
}

interface Props {
  ref: any;
  style: CSSProperties;
}

interface RenderProps {
  toggleVisibility?: () => void;
  forwardRef?: RefHandler;
}

class Popover extends React.Component<InnerProps> {
  public state: State = {
    visible: false,
  };

  public toggleVisibility = () => {
    this.setState((state: State) => ({
      visible: !state.visible,
    }));
  };

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
          {(props: Props) =>
            children({
              forwardRef: props.ref,
              toggleVisibility: this.toggleVisibility,
            })
          }
        </Reference>
        <Popper
          placement={placement}
          modifiers={{ preventOverflow: { enabled: false } }}
          eventsEnabled
          positionFixed={false}
        >
          {(props: Props) =>
            visible && (
              <div
                id={id}
                role="popup"
                aria-labelledby={`${id}-ariainfo`}
                aria-hidden={!visible}
              >
                <AriaInfo id={`${id}-ariainfo`}>{description}</AriaInfo>

                {/* <ClickOutside onClickOutside={onClose}> */}
                <div
                  style={props.style}
                  className={cn(styles.root, className)}
                  ref={props.ref}
                >
                  {isValidElement(body)
                    ? body
                    : body({
                        toggleVisibility: this.toggleVisibility,
                        forwardRef: props.ref,
                      })}
                </div>
                {/* </ClickOutside> */}
              </div>
            )
          }
        </Popper>
      </Manager>
    );
  }
}

export default Popover;
