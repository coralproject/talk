import cn from "classnames";
import React, { CSSProperties } from "react";
import { Manager, Popper, Reference, RefHandler } from "react-popper";
import AriaInfo from "../AriaInfo";
import * as styles from "./Popover.css";

interface RenderProps {
  toggleVisibility?: () => void;
  forwardRef?: RefHandler;
}

interface InnerProps {
  body: (props: RenderProps) => any;
  // body: React.ReactElement<any> | null;
  children: (props: RenderProps) => any;
  description?: string;
  id?: string;
  onClose?: () => void;
  className?: string;
}

interface State {
  visible: false;
}

interface Props {
  ref: any;
  style: CSSProperties;
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
    const { id, body, children, description, className } = this.props;

    const { visible } = this.state;

    return (
      <Manager>
        <Reference>
          {(props: Props) => children({ forwardRef: props.ref })}
        </Reference>
        <Popper
          modifiers={{ preventOverflow: { enabled: false } }}
          eventsEnabled
          positionFixed={false}
        >
          {(props: Props) => (
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
                {body({
                  toggleVisibility: this.toggleVisibility,
                  forwardRef: props.ref,
                })}
              </div>
              {/* </ClickOutside> */}
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

export default Popover;
