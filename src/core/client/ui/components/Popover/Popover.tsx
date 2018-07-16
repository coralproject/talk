import React from "react";
import Attachment from "../Attachment";
import * as styles from "./Popover.css";

interface RenderProps {
  toggleShow: () => void;
}

interface InnerProps {
  body: React.ReactElement<Props> | null;
  children: (props: RenderProps) => React.ReactElement<any>;
}

interface Props {
  ref: any;
}

interface State {
  show: false;
}

class Popover extends React.Component<InnerProps> {
  public state: State = {
    show: false,
  };

  public toggleShow = () => {
    this.setState((state: State) => ({
      show: !state.show,
    }));
  };

  public render() {
    const { body, children } = this.props;
    // const { show } = this.state;
    console.log(children);
    return (
      <Attachment body={body} className={styles.root}>
        {({ ref }) => children({ toggleShow: this.toggleShow, ref })}
      </Attachment>
    );
  }
}

export default Popover;
