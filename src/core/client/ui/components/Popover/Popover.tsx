import React from "react";
import { Manager, Popper, Reference } from "react-popper";
// import * as styles from "./Popover.css";

interface InnerProps {
  body: React.ReactElement<any>;
  children: React.ReactElement<any>;
}

class Popover extends React.Component<InnerProps> {
  public render() {
    const { children, body } = this.props;
    return (
      <Manager>
        <Reference>
          {({ ref }) => React.cloneElement(children, { ref })}
        </Reference>
        <Popper placement="right">
          {({ ref, style, placement, arrowProps }) =>
            React.cloneElement(body, {
              ref,
              style,
              "data-placement": placement,
            })
          }
        </Popper>
      </Manager>
    );
  }
}

export default Popover;
