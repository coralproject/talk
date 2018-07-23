import { mount } from "enzyme";
import React from "react";
import ReactDOM from "react-dom";
import simulant from "simulant";
import sinon from "sinon";

import Button from "../Button/Button";
import ClickOutside from "./ClickOutside";

export class Dummy extends React.Component<{ onButtonClick: () => void }> {
  public render() {
    return (
      <header style={{ background: "blue", padding: "30px" }}>
        <ClickOutside onClickOutside={this.props.onButtonClick}>
          <Button variant="filled">Push Me</Button>
        </ClickOutside>
      </header>
    );
  }
}

it("renders correctly", () => {
  const onButtonClick = sinon.spy();
  const wrapper = mount(<Dummy onButtonClick={onButtonClick} />);

  const target = ReactDOM.findDOMNode(wrapper.find("header").instance());
  simulant.fire(target, "click");

  // Uncomment this. This should work.
  // wrapper.find("header").simulate('click');
  // expect(onButtonClick.calledOnce).toEqual(true);
  // expect(onButtonClick.called).toBeTruthy();
  expect(wrapper).toMatchSnapshot();
});
