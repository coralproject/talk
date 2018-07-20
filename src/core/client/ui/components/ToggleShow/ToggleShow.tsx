import React, { ReactNode } from "react";

interface State {
  show: boolean;
}

interface Props {
  children: (props: RenderProps) => ReactNode;
}

interface RenderProps {
  toggleShow: () => void;
  show: boolean;
}

class ToggleShow extends React.Component<Props, State> {
  public state = {
    show: true,
  };

  public toggleShow = () => {
    this.setState(state => ({ show: !state.show }));
  };

  public render() {
    return this.props.children({
      toggleShow: this.toggleShow,
      show: this.state.show,
    });
  }
}

export default ToggleShow;
