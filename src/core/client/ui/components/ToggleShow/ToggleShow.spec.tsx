import React from "react";
import { create } from "react-test-renderer";

import ToggleShow from "./ToggleShow";

it("renders correctly", () => {
  const tree = create(
    <ToggleShow>
      {({ toggleShow, show }) => (
        <div>
          {show && <div>SHOW ME</div>}
          <button onClick={toggleShow}>Click me and I disapear</button>
        </div>
      )}
    </ToggleShow>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it("should hide the div", () => {
  const renderer = create(
    <ToggleShow>
      {({ toggleShow, show }) => (
        <div>
          {show && <div>SHOW ME</div>}
          <button onClick={toggleShow}>Click me and I disappear</button>
        </div>
      )}
    </ToggleShow>
  );

  renderer.root.findByType("button").props.onClick();
  expect(renderer.toJSON()).toMatchSnapshot();
});
